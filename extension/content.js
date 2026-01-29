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
      const feature = btn.innerText.replace(/[^a-zA-Z]/g, "").trim();

      const selectedText = window.getSelection().toString().trim();

      chatTitle.innerText = feature;
      chatbox.classList.add("open");
      featurePanel.style.display = "none";

      chatInput.style.display = "none";
      chatMessages.style.display = "none";
      resultView.innerHTML = "";

      if (feature === "🔍Research") {
        chatbox.style.display = "flex";
        resultView.style.display = "none";
        chatMessages.style.display = "block";
        chatInput.style.display = "flex";
      
        if (!chatMessages.innerHTML.trim()) {
          chatMessages.innerHTML = `
            <div class="msg bot">Hi 👋 Ask me anything.</div>
          `;
        }
      
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

  console.log("SmAs.AI widget initialized");
}
