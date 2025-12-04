// Simple function to call a phone number
function callPhone() {
  const phoneNumber = '+34911676409';
  window.location.href = `tel:${phoneNumber}`;
}

// Call the function immediately when script loads
callPhone();

// Alternative: If you want to call it on button click or event
// document.getElementById('callButton').addEventListener('click', callPhone);

