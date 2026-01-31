# backend/rag/query.py

from typing import List

from rag.vector_store import get_vector_store
from core.openai_client import get_embedding, get_chat_completion


class RAGQueryEngine:
    def __init__(self):
        self.store = None

    def query(self, question: str, top_k: int = 5) -> str:
        # 🔹 create embedding for the question
        query_embedding = get_embedding(question)

        # 🔹 get SHARED vector store (SAME AS INGEST)
        self.store = get_vector_store(dim=len(query_embedding))

        # 🔹 retrieve relevant chunks
        results = self.store.search(query_embedding, top_k=top_k)

        if not results:
            return "I don't know from this page."

        # 🔹 build context from retrieved chunks
        context_blocks: List[str] = []
        for item in results:
            context_blocks.append(item["text"])

        context = "\n\n".join(context_blocks)

        # 🔹 grounded prompt (NO hallucination)
        prompt = f"""
You are a research assistant.
Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't know from this page."

Context:
{context}

Question:
{question}
"""

        # 🔹 ask LLM
        answer = get_chat_completion(prompt)
        return answer


