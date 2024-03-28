document.getElementById('sentimentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('urlInput').value;
    fetch('/analyze_sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = `Sentiment: ${data.sentiment}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
