import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class Retriever:
    def __init__(self):
        self.items = json.loads(Path(__file__).with_name("knowledge_base.json").read_text())
        corpus = [" ".join(x["keywords"]) + " " + x["title"] + " " + x["content"] for x in self.items]
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.matrix = self.vectorizer.fit_transform(corpus)

    def search(self, query):
        scores = cosine_similarity(self.vectorizer.transform([query]), self.matrix)[0]
        i = int(scores.argmax())
        return self.items[i], float(scores[i])

retriever = Retriever()
