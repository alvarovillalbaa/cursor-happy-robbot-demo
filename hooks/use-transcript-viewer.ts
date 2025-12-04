"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CharacterAlignmentResponseModel } from "@elevenlabs/elevenlabs-js/api/types/CharacterAlignmentResponseModel"

export type TranscriptWord = {
    kind: "word"
    text: string
    start: number
    end: number
    segmentIndex: number
}

export type TranscriptGap = {
    kind: "gap"
    text: string
    start: number
    end: number
    segmentIndex: number
}

export type TranscriptSegment = TranscriptWord | TranscriptGap

export type SegmentComposer = (
    segments: TranscriptSegment[]
) => TranscriptSegment[]

export type UseTranscriptViewerOptions = {
    alignment: CharacterAlignmentResponseModel
    hideAudioTags?: boolean
    segmentComposer?: SegmentComposer
    onPlay?: () => void
    onPause?: () => void
    onTimeUpdate?: (time: number) => void
    onEnded?: () => void
    onDurationChange?: (duration: number) => void
}

export type UseTranscriptViewerResult = {
    audioRef: React.RefObject<HTMLAudioElement | null>
    spokenSegments: TranscriptSegment[]
    unspokenSegments: TranscriptSegment[]
    currentWord: TranscriptWord | null
    segments: TranscriptSegment[]
    duration: number
    currentTime: number
    isPlaying: boolean
    isScrubbing: boolean
    play: () => Promise<void>
    pause: () => void
    seekToTime: (time: number) => void
    startScrubbing: () => void
    endScrubbing: () => void
}

function parseAlignment(
    alignment: CharacterAlignmentResponseModel,
    hideAudioTags: boolean = true
): TranscriptSegment[] {
    const segments: TranscriptSegment[] = []
    let segmentIndex = 0

    const { characters, characterStartTimesSeconds, characterEndTimesSeconds } =
        alignment

    if (!characters || characters.length === 0) {
        return segments
    }

    // Group characters into words based on spaces and timing gaps
    let i = 0
    while (i < characters.length) {
        const char = characters[i]
        const startTime =
            characterStartTimesSeconds?.[i] ?? characterEndTimesSeconds?.[i - 1] ?? 0
        const endTime = characterEndTimesSeconds?.[i] ?? startTime

        // Skip if this is a space and we want to hide audio tags (spaces might be considered audio tags)
        if (hideAudioTags && char.trim() === "") {
            i++
            continue
        }

        // Start building a word
        let wordText = char
        let wordStart = startTime
        let wordEnd = endTime
        let j = i + 1

        // Collect characters until we hit a space or significant time gap
        while (j < characters.length) {
            const nextChar = characters[j]
            const nextStartTime =
                characterStartTimesSeconds?.[j] ??
                characterEndTimesSeconds?.[j - 1] ??
                wordEnd
            const nextEndTime = characterEndTimesSeconds?.[j] ?? nextStartTime

            // Check for time gap (more than 0.1 seconds) or space
            const timeGap = nextStartTime - wordEnd
            if (nextChar === " " || timeGap > 0.1) {
                // Add gap if there's a significant time gap
                if (timeGap > 0.01 && segments.length > 0) {
                    segments.push({
                        kind: "gap",
                        text: " ",
                        start: wordEnd,
                        end: nextStartTime,
                        segmentIndex: segmentIndex++,
                    })
                }
                break
            }

            wordText += nextChar
            wordEnd = nextEndTime
            j++
        }

        // Add the word segment
        segments.push({
            kind: "word",
            text: wordText.trim(),
            start: wordStart,
            end: wordEnd,
            segmentIndex: segmentIndex++,
        })

        i = j
    }

    return segments
}

export function useTranscriptViewer({
    alignment,
    hideAudioTags = true,
    segmentComposer,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onDurationChange,
}: UseTranscriptViewerOptions): UseTranscriptViewerResult {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isScrubbing, setIsScrubbing] = useState(false)

    // Parse alignment into segments
    const rawSegments = useMemo(
        () => parseAlignment(alignment, hideAudioTags),
        [alignment, hideAudioTags]
    )

    // Apply segment composer if provided
    const segments = useMemo(() => {
        if (segmentComposer) {
            return segmentComposer(rawSegments)
        }
        return rawSegments
    }, [rawSegments, segmentComposer])

    // Find current word based on current time
    const currentWord = useMemo(() => {
        if (isScrubbing) {
            return null
        }

        const word = segments.find(
            (segment): segment is TranscriptWord =>
                segment.kind === "word" &&
                currentTime >= segment.start &&
                currentTime < segment.end
        ) as TranscriptWord | undefined

        return word ?? null
    }, [currentTime, segments, isScrubbing])

    // Split segments into spoken and unspoken
    const { spokenSegments, unspokenSegments } = useMemo(() => {
        if (isScrubbing) {
            const spoken = segments.filter(
                (segment) => currentTime >= segment.end
            )
            const unspoken = segments.filter(
                (segment) => currentTime < segment.start
            )
            return { spokenSegments: spoken, unspokenSegments: unspoken }
        }

        if (currentWord) {
            const currentIndex = segments.indexOf(currentWord)
            const spoken = segments.slice(0, currentIndex)
            const unspoken = segments.slice(currentIndex + 1)
            return { spokenSegments: spoken, unspokenSegments: unspoken }
        }

        // If no current word, check if we're past all segments
        const lastSegment = segments[segments.length - 1]
        if (lastSegment && currentTime >= lastSegment.end) {
            return { spokenSegments: segments, unspokenSegments: [] }
        }

        return { spokenSegments: [], unspokenSegments: segments }
    }, [segments, currentWord, currentTime, isScrubbing])

    // Audio event handlers
    const handleTimeUpdate = useCallback(() => {
        if (!audioRef.current || isScrubbing) return
        const time = audioRef.current.currentTime
        setCurrentTime(time)
        onTimeUpdate?.(time)
    }, [isScrubbing, onTimeUpdate])

    const handleDurationChange = useCallback(() => {
        if (!audioRef.current) return
        const newDuration = audioRef.current.duration
        if (newDuration && !isNaN(newDuration)) {
            setDuration(newDuration)
            onDurationChange?.(newDuration)
        }
    }, [onDurationChange])

    const handlePlay = useCallback(() => {
        setIsPlaying(true)
        onPlay?.()
    }, [onPlay])

    const handlePause = useCallback(() => {
        setIsPlaying(false)
        onPause?.()
    }, [onPause])

    const handleEnded = useCallback(() => {
        setIsPlaying(false)
        setCurrentTime(0)
        onEnded?.()
    }, [onEnded])

    // Set up audio event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("durationchange", handleDurationChange)
        audio.addEventListener("play", handlePlay)
        audio.addEventListener("pause", handlePause)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("loadedmetadata", handleDurationChange)

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("durationchange", handleDurationChange)
            audio.removeEventListener("play", handlePlay)
            audio.removeEventListener("pause", handlePause)
            audio.removeEventListener("ended", handleEnded)
            audio.removeEventListener("loadedmetadata", handleDurationChange)
        }
    }, [
        handleTimeUpdate,
        handleDurationChange,
        handlePlay,
        handlePause,
        handleEnded,
    ])

    // Control functions
    const play = useCallback(async () => {
        if (!audioRef.current) return
        try {
            await audioRef.current.play()
        } catch (error) {
            console.error("Error playing audio:", error)
        }
    }, [])

    const pause = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
    }, [])

    const seekToTime = useCallback(
        (time: number) => {
            if (!audioRef.current) return
            audioRef.current.currentTime = Math.max(0, Math.min(time, duration || 0))
            setCurrentTime(audioRef.current.currentTime)
        },
        [duration]
    )

    const startScrubbing = useCallback(() => {
        setIsScrubbing(true)
    }, [])

    const endScrubbing = useCallback(() => {
        setIsScrubbing(false)
    }, [])

    return {
        audioRef,
        spokenSegments,
        unspokenSegments,
        currentWord,
        segments,
        duration,
        currentTime,
        isPlaying,
        isScrubbing,
        play,
        pause,
        seekToTime,
        startScrubbing,
        endScrubbing,
    }
}

