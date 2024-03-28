from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
import requests
import re

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    url = request.json['url']
    review_text = extract_reviews(url)
    sentiment = analyze_text_sentiment(review_text)
    positive_sentences = extract_positive_sentences(review_text)
    return jsonify({'sentiment': sentiment, 'positive_sentences': positive_sentences})

def extract_reviews(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  
        soup = BeautifulSoup(response.content, 'html.parser')
        review_elements = soup.find_all('div', class_='review')  
        review_text = [review.get_text(separator='\n') for review in review_elements]
        
        return '\n'.join(review_text)
    except Exception as e:
        print(f"Error occurred while extracting reviews: {e}")
        return None

def analyze_text_sentiment(text):
    positive_keywords = ['good', 'great', 'excellent', 'love', 'awesome']
    negative_keywords = ['bad', 'poor', 'terrible', 'dislike', 'awful']
    
    num_positive = sum(text.lower().count(keyword) for keyword in positive_keywords)
    num_negative = sum(text.lower().count(keyword) for keyword in negative_keywords)
    
    if num_positive > num_negative:
        return 'positive'
    elif num_positive < num_negative:
        return 'negative'
    else:
        return 'neutral'

def extract_positive_sentences(review_text):
    positive_keywords = ['good', 'great', 'excellent', 'love', 'awesome']
    sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', review_text)
    positive_sentences = [sentence.strip() for sentence in sentences if any(keyword in sentence.lower() for keyword in positive_keywords)]
    return positive_sentences

if __name__ == '__main__':
    app.run(debug=True)
