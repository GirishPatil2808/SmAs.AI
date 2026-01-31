from rag.chunk import TextChunker

text = """
Retrieval-Augmented Generation (RAG) is a technique that enhances
large language models by providing them with relevant external context.
It works by embedding documents into a vector database and retrieving
the most relevant pieces at query time.
"""

chunker = TextChunker(chunk_size=30, chunk_overlap=5)
chunks = chunker.split_text(text)

for i, chunk in enumerate(chunks):
    print(f"\n--- Chunk {i+1} ---")
    print(chunk)
