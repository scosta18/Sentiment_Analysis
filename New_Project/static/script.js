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
        
        // Display positive sentences if available
        if (data.positive_sentences && data.positive_sentences.length > 0) {
            const positiveSentencesDiv = document.getElementById('positiveSentences');
            positiveSentencesDiv.innerHTML = '<p><strong>Positive Sentences:</strong></p>';
            data.positive_sentences.forEach(sentence => {
                positiveSentencesDiv.innerHTML += `<p>${sentence}</p>`;
            });
        } else {
            const positiveSentencesDiv = document.getElementById('positiveSentences');
            positiveSentencesDiv.innerHTML = '<p>No positive sentences found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
