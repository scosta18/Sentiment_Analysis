document.getElementById('sentimentForm').addEventListener('submit', function (event) {
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
            // Display sentiment analysis result
            const resultElement = document.getElementById('cen');
            resultElement.innerText = `Sentiment: ${data.sentiment}`;

            // Display positive reviews if available
            const positiveSentencesDiv = document.getElementById('positiveSentences');
            if (data.positive_sentences && data.positive_sentences.length > 0) {
                positiveSentencesDiv.innerHTML = '<p><strong>Positive Reviews:</strong></p>';
                data.positive_sentences.forEach(sentence => {
                    positiveSentencesDiv.innerHTML += `<p>${sentence}</p>`;
                });
            } else {
                positiveSentencesDiv.innerHTML = '<p>No positive sentences found.</p>';
            }

            // Calculate sentiment score (assuming sentiment is normalized between -1 and 1)
            const statusBox = document.getElementById('statusBox');

            // Calculate sentiment score (assuming sentiment is normalized between -1 and 1)
            let sentimentScore = 0;
            if (data.sentiment === 'positive') {
                sentimentScore = 1;
            } else if (data.sentiment === 'negative') {
                sentimentScore = -1;
            }

            // Set the background color of the status box based on sentiment score
            const green = Math.floor(255 * (sentimentScore + 1) / 2); // positive sentiment
            const red = Math.floor(255 * (1 - sentimentScore) / 2); // negative sentiment
            statusBox.style.backgroundColor = `rgb(${red}, ${green}, 0)`;

        })
        .catch(error => {
            console.error('Error:', error);
        });
});
