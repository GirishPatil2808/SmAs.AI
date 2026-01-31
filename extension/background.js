chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "RAG_INGEST") {
    fetch("http://127.0.0.1:8000/rag/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
      .then(() => sendResponse({ status: "ok" }))
      .catch(err => sendResponse({ error: err.message }));

    return true; // REQUIRED
  }

  if (message.type === "RAG_QUERY") {
    fetch("http://127.0.0.1:8000/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    })
      .then(res => res.json())
      .then(data => sendResponse({ answer: data.answer }))
      .catch(err => sendResponse({ error: err.message }));

    return true; // REQUIRED
  }
});
