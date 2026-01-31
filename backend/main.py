from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag.ingest import RAGIngestor
from rag.query import RAGQueryEngine

app = FastAPI(title="SmAs.AI RAG Backend")

# CORS (DEV)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ingestor = RAGIngestor()
query_engine = RAGQueryEngine()

class IngestRequest(BaseModel):
    text: str
    source_url: str
    title: str

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

@app.post("/rag/ingest")
def ingest_page(data: IngestRequest):
    count = ingestor.ingest(
        text=data.text,
        source_url=data.source_url,
        title=data.title,
    )
    return {
        "status": "success",
        "chunks_ingested": count
    }

@app.post("/rag/query")
def query_rag(data: QueryRequest):
    answer = query_engine.query(
        question=data.question,
        top_k=data.top_k
    )
    return {"answer": answer}
