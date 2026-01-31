from rag.store import VectorStore

_vector_store = None

def get_vector_store(dim: int):
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore(dim=dim)
    return _vector_store
