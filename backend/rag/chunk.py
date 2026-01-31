# backend/rag/chunk.py

from typing import List
import re
import tiktoken


class TextChunker:
    def __init__(
        self,
        model_name: str = "gpt-4o-mini",
        chunk_size: int = 500,
        chunk_overlap: int = 50,
    ):
        """
        chunk_size: number of tokens per chunk
        chunk_overlap: overlapping tokens between chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoder = tiktoken.encoding_for_model(model_name)

    def clean_text(self, text: str) -> str:
        """
        Cleans raw webpage text
        """
        # Remove excessive whitespace
        text = re.sub(r"\s+", " ", text)

        # Remove weird invisible characters
        text = text.replace("\u00a0", " ")

        return text.strip()

    def tokenize(self, text: str) -> List[int]:
        return self.encoder.encode(text)

    def detokenize(self, tokens: List[int]) -> str:
        return self.encoder.decode(tokens)

    def split_text(self, text: str) -> List[str]:
        """
        Main method: clean → tokenize → chunk → detokenize
        """
        cleaned_text = self.clean_text(text)
        tokens = self.tokenize(cleaned_text)

        chunks = []
        start = 0

        while start < len(tokens):
            end = start + self.chunk_size
            chunk_tokens = tokens[start:end]
            chunk_text = self.detokenize(chunk_tokens)
            chunks.append(chunk_text)

            start += self.chunk_size - self.chunk_overlap

        return chunks
