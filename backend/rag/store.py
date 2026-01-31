# backend/rag/store.py

import os
import pickle
from typing import List, Dict

import faiss
import numpy as np


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)
VECTOR_DIR = os.path.join(BASE_DIR, "data", "vectors")


class VectorStore:
    def __init__(self, dim: int):
        self.dim = dim
        self.store_path = VECTOR_DIR

        self.index_file = os.path.join(self.store_path, "index.faiss")
        self.meta_file = os.path.join(self.store_path, "index.pkl")

        os.makedirs(self.store_path, exist_ok=True)

        if os.path.exists(self.index_file) and os.path.exists(self.meta_file):
            self.index = faiss.read_index(self.index_file)
            with open(self.meta_file, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(dim)
            self.metadata = []

    def add(self, embeddings: List[List[float]], metadatas: List[Dict]):
        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.metadata.extend(metadatas)
        self._save()

    def search(self, query_embedding: List[float], top_k: int = 5):
        query_vector = np.array([query_embedding]).astype("float32")
        distances, indices = self.index.search(query_vector, top_k)

        results = []
        for idx in indices[0]:
            if idx != -1:
                results.append(self.metadata[idx])

        return results

    def _save(self):
        faiss.write_index(self.index, self.index_file)
        with open(self.meta_file, "wb") as f:
            pickle.dump(self.metadata, f)
