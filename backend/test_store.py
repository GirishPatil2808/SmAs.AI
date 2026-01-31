from rag.store import VectorStore

# Fake embeddings (dimension = 4 for test)
store = VectorStore(dim=4)

embeddings = [
    [0.1, 0.2, 0.3, 0.4],
    [0.2, 0.1, 0.4, 0.3],
]

metadata = [
    {"text": "First chunk", "source": "page1"},
    {"text": "Second chunk", "source": "page2"},
]

store.add(embeddings, metadata)

query = [0.1, 0.2, 0.3, 0.4]
results = store.search(query)

print(results)
