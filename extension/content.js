(function initSmAs() {
  if (document.querySelector('[data-smas-widget="true"]')) {
    console.log("SmAs.AI already injected");
    return;
  }

  console.log("SmAs.AI content script running");

  // inject CSS
  // inject HTML
  // initSmAsWidget();
})();
// Inject CSS
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = chrome.runtime.getURL("widget.css");
document.head.appendChild(css);

// Inject HTML
fetch(chrome.runtime.getURL("index.html"))
  .then(res => res.text())
  .then(html => {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // 🚀 NOW initialize widget logic
    
    initSmAsWidget();
  })
  .catch(err => console.error("SmAs.AI injection failed:", err));


// =========================
// ALL WIDGET LOGIC HERE
// =========================
function initSmAsWidget() {

    // =========================
  // AUTO-INGEST STATE
  // =========================
  const INGESTED_PAGES_KEY = "smas_ingested_pages";

  let ingestedPages = new Set(
    JSON.parse(localStorage.getItem(INGESTED_PAGES_KEY) || "[]")
  );

  function saveIngestedPages() {
    localStorage.setItem(
      INGESTED_PAGES_KEY,
      JSON.stringify([...ingestedPages])
    );
  }

    // =========================
  // PAGE TEXT EXTRACTOR
  // =========================
  function extractPageText() {
  const isWikipedia = location.hostname.includes("wikipedia.org");

  let summaryBlock = "";

  if (isWikipedia) {
    try {
      const title =
        document.querySelector("#firstHeading")?.innerText?.trim() || "";

      const contentRoot = document.querySelector("#mw-content-text");
      let leadParagraph = "";

      if (contentRoot) {
        const paragraphs = contentRoot.querySelectorAll("p");
        for (const p of paragraphs) {
          const text = p.innerText.trim();
          if (text.length > 100) {
            leadParagraph = text;
            break;
          }
        }
      }

      if (leadParagraph) {
        summaryBlock = `PAGE SUMMARY:\n${leadParagraph}\n\nPAGE TITLE:\n${title}\n\n`;
      }
    } catch (e) {
      console.warn("Wikipedia summary extraction failed:", e);
    }
  }

  // Clone full body for general content
  const clone = document.body.cloneNode(true);
  clone
    .querySelectorAll(
      "script, style, nav, footer, header, aside, noscript"
    )
    .forEach(el => el.remove());

  const fullText = (clone.innerText || "")
    .replace(/\s+/g, " ")
    .trim();

  return summaryBlock + "PAGE CONTENT:\n" + fullText;
}


    // =========================
  // AUTO-INGEST FUNCTION
  // =========================
  async function autoIngestCurrentPage() {
    const url = location.href;

    if (ingestedPages.has(url)) {
      console.log("SmAs.AI: Page already ingested");
      return;
    }

    const text = extractPageText();

    if (!text || text.length < 800) {
      console.warn("SmAs.AI: Page too small to ingest");
      return;
    }

    try {
     chrome.runtime.sendMessage({
  type: "RAG_INGEST",
  payload: {
    text,
    source_url: url,
    title: document.title || "Untitled Page",
  }
});


      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      console.log("SmAs.AI ingested successfully");


      ingestedPages.add(url);
      saveIngestedPages();

    } catch (err) {
      console.warn("SmAs.AI auto-ingest failed:", err.message);
    }
  }

  const widget = document.getElementById("widget");
  const askBtn = document.getElementById("widget_button");
  const featurePanel = document.getElementById("feature_panel");
  const chatbox = document.getElementById("chatbox");
  const chatTitle = document.getElementById("chat_title");
  const closeBtn = document.getElementById("chat_close");
  const resultView = document.getElementById("result_view");
  const chatInput = document.getElementById("chat_input");
  const chatMessages = document.getElementById("chat_messages");

  if (!widget) {
    console.error("SmAs.AI widget not found");
    return;
  }

  // -----------------
  // DRAG LOGIC
  // -----------------
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  widget.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = widget.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });
  // -----------------
// CHATBOX DRAG LOGIC
// -----------------
let isChatDragging = false;
let chatOffsetX = 0;
let chatOffsetY = 0;

const chatHeader = document.querySelector(".chat_header");

chatHeader.addEventListener("mousedown", (e) => {
  // ❌ if close button clicked → don't drag
  if (e.target.id === "chat_close") return;

  isChatDragging = true;
  const rect = chatbox.getBoundingClientRect();
  chatOffsetX = e.clientX - rect.left;
  chatOffsetY = e.clientY - rect.top;

  chatbox.style.right = "auto";
});


document.addEventListener("mousemove", (e) => {
  if (!isChatDragging) return;

  chatbox.style.left = `${e.clientX - chatOffsetX}px`;
  chatbox.style.top = `${e.clientY - chatOffsetY}px`;
});

document.addEventListener("mouseup", () => {
  isChatDragging = false;
});


  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    widget.style.left = `${e.clientX - offsetX}px`;
    widget.style.top = `${e.clientY - offsetY}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // -----------------
  // FEATURE PANEL
  // -----------------
  askBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    featurePanel.style.display =
      featurePanel.style.display === "flex" ? "none" : "flex";
  });

  // CLICK OUTSIDE TO CLOSE BOTH CHATBOX AND FEATURE PANEL
document.addEventListener("mousedown", (e) => {
  const target = e.target;

  // Close chatbox if click is outside both chatbox and widget
  if (chatbox.classList.contains("open") &&
      !chatbox.contains(target) &&
      !widget.contains(target)) {
    chatbox.classList.remove("open");
  }

  // Close feature panel if click is outside widget
  if (featurePanel.style.display === "flex" &&
      !widget.contains(target)) {
    featurePanel.style.display = "none";
  }
});

// Prevent clicks inside chatbox or feature panel from closing them
chatbox.addEventListener("mousedown", e => e.stopPropagation());
featurePanel.addEventListener("mousedown", e => e.stopPropagation());

  featurePanel.addEventListener("mousedown", e => e.stopPropagation());

  // -----------------
  // FEATURE HANDLING
  // -----------------
  document.querySelectorAll(".feature_btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const feature = btn.dataset.feature;
      const selectedText = window.getSelection().toString().trim();

      chatTitle.innerText = feature;
      chatbox.classList.add("open");
      featurePanel.style.display = "none";

      chatInput.style.display = "none";
      chatMessages.style.display = "none";
      resultView.innerHTML = "";

      if (feature === "Research") {
        chatbox.style.display = "flex";
        resultView.style.display = "none";
        chatMessages.style.display = "block";
        chatInput.style.display = "flex";

        if (!chatMessages.innerHTML.trim()) {
          chatMessages.innerHTML = `
            <div class="msg bot">
              📄 <strong>From this page</strong><br/>
              Hi 👋 Ask me anything about this page.
            </div>
          `;
        }

        // 🔥 AUTO-INGEST CURRENT PAGE
        autoIngestCurrentPage();
      }

      else {
        chatMessages.style.display = "none";
        chatInput.style.display = "none";
        resultView.style.display = "block";
        if (!selectedText) {
          resultView.innerHTML = "<p>Please select text first.</p>";
        } else {
          resultView.innerHTML =
            `<h4>${feature}</h4><p>${selectedText.slice(0,300)}...</p>`;
        }
      }
    });
  });

  closeBtn.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  closeBtn.addEventListener("click", () => {
    chatbox.classList.remove("open");
  
    // 🔥 reset drag positioning
    chatbox.style.left = "";
    chatbox.style.top = "";
    chatbox.style.right = "-360px";
  });


  // -----------------
// RESEARCH CHAT LOGIC
// -----------------

const chatInputField = chatInput.querySelector("input");
const sendBtn = chatInput.querySelector("button");

// helper: add message to UI
function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
sendBtn.addEventListener("click", async () => {
  const question = chatInputField.value.trim();
  if (!question) return;

  // show user message
  addMessage(question, "user");
  chatInputField.value = "";

  // show thinking placeholder
  const thinkingMsg = document.createElement("div");
  thinkingMsg.className = "msg bot";
  thinkingMsg.textContent = "Thinking...";
  chatMessages.appendChild(thinkingMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
chrome.runtime.sendMessage(
  {
    type: "RAG_QUERY",
    payload: {
      question: question,
      top_k: 5,
    }
  },
  (response) => {
    if (!response || response.error) {
      thinkingMsg.textContent = "Temporary issue. Please retry.";
      return;
    }
    thinkingMsg.textContent = response.answer;
  }
);


} catch (err) {
  console.warn("RAG query issue:", err.message);
  thinkingMsg.textContent = "Temporary issue. Please retry.";
}

});

// Send on Enter key
chatInputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

  console.log("SmAs.AI widget initialized");
}
