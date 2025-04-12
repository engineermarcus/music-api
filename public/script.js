function searchVideo() {
  const query = document.getElementById('search-query').value;
  
  if (!query) {
    alert("Please enter a query.");
    return;
  }

  fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => {
      console.error("Error fetching video:", error);
      alert("Something went wrong. Please try again.");
    });
}

function displayResults(data) {
  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = ''; // clear previous results

  data.forEach(item => {
    const videoElement = document.createElement('div');
    videoElement.classList.add('result-item');
    
    videoElement.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <a href="/download/${item.videoId}?format=mp3" target="_blank">Download MP3</a>
      <a href="/download/${item.videoId}?format=mp4" target="_blank">Download MP4</a>
    `;

    resultContainer.appendChild(videoElement);
  });
}

// On page load, preload some trending songs
window.onload = function() {
  fetch('http://localhost:3000/api/search?q=trending')
    .then(response => response.json())
    .then(data => {
      displayResults(data); // Display trending songs
    })
    .catch(error => {
      console.error("Error loading trending songs:", error);
    });
};

