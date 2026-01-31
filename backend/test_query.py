from rag.query import RAGQueryEngine

engine = RAGQueryEngine()

question = "What is Retrieval-Augmented Generation?"
answer = engine.query(question)

print("ANSWER:\n", answer)
