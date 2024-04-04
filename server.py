from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from flask_cors import CORS

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['ai']
collection = db['promptOptions']

documents = collection.find({}, {'prompt': 1, 'promptOptions': 1})

# Extract prompts and options from each document
data = []
for doc in documents:
    prompt = doc['prompt']
    options = doc['promptOptions']
    data.append((prompt, options))

with open('parameter.txt', 'r') as file:
    for line in file:
        # Remove newline characters and parse the line
        line = line.strip()
        # Assuming the format is ('prompt', ['option1', 'option2', ...])
        # We use eval to convert the string representation of a tuple into an actual tuple
        prompt_options = eval(line)
        data.append(prompt_options)

# Separate prompts and options
prompts = [item[0] for item in data]
options = [item[1] for item in data]

# Convert options to a binary matrix
mlb = MultiLabelBinarizer()
options_bin = mlb.fit_transform(options)#['image','link','text','video'] => [1, 0, 1, 0]
print("Unique labels in order:", mlb.classes_)

# Convert prompts to numerical features
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(prompts)
# print(X)

model = make_pipeline(TfidfVectorizer(), OneVsRestClassifier(MultinomialNB()))
# Train the model
model.fit(prompts, options_bin)

CORS(app)
@app.route('/api/getOptions', methods=['POST'])
def get_options():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Predict options
    predicted_options_bin = model.predict([prompt])
    # Convert binary predictions back to labels
    predicted_options = mlb.inverse_transform(predicted_options_bin)

    return jsonify({"options": predicted_options[0]})

if __name__ == '__main__':
    app.run(debug=True)