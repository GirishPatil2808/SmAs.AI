from rag.ingest import RAGIngestor

text = """
Retrieval-Augmented Generation (RAG) improves language models
by retrieving relevant context from external knowledge sources.
This reduces hallucinations and increases factual accuracy.
"""

ingestor = RAGIngestor()

count = ingestor.ingest(
    text=text,
    source_url="https://example.com/rag",
    title="RAG Test Page"
)

print("Chunks ingested:", count)
