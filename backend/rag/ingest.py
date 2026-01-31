# backend/rag/ingest.py

from typing import List, Dict
from datetime import datetime

from rag.chunk import TextChunker
from rag.vector_store import get_vector_store
from core.openai_client import get_embedding


class RAGIngestor:
    def __init__(self):
        self.chunker = TextChunker()
        self.store = None

    def ingest(
        self,
        text: str,
        source_url: str,
        title: str,
    ) -> int:
        chunks = self.chunker.split_text(text)

        if not chunks:
            return 0

        # 🔹 generate first embedding to determine vector dimension
        first_embedding = get_embedding(chunks[0])

        # 🔹 get SHARED vector store (THIS IS THE FIX)
        self.store = get_vector_store(dim=len(first_embedding))

        embeddings: List[List[float]] = [first_embedding]
        metadatas: List[Dict] = [{
            "text": chunks[0],
            "source": source_url,
            "title": title,
            "ingested_at": datetime.utcnow().isoformat()
        }]

        # 🔹 process remaining chunks
        for chunk in chunks[1:]:
            embedding = get_embedding(chunk)
            embeddings.append(embedding)

            metadatas.append({
                "text": chunk,
                "source": source_url,
                "title": title,
                "ingested_at": datetime.utcnow().isoformat()
            })

        # 🔹 store all chunks in shared memory
        self.store.add(embeddings, metadatas)

        return len(embeddings)
