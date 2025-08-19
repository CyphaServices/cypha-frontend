// Function to launch YouTube in a new tab/window
function launchYouTube() {
  window.open("https://www.youtube.com", "_blank");
}

// Function to open LAN Bingo client
function openLANBingo() {
  // Adjust URL to your Bingo server IP
  window.location.href = "https://bingo.cyphaent.com/client.html";
}

// DOMContentLoaded ensures DOM is fully loaded before running scripts
window.addEventListener('DOMContentLoaded', () => {
  // Attach event listener to YouTube button
  const youtubeBtn = document.getElementById('youtubeBtn');
  youtubeBtn.addEventListener('click', launchYouTube);
});