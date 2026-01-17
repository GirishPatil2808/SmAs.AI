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

  document.addEventListener("click", () => {
    featurePanel.style.display = "none";
  });

  featurePanel.addEventListener("mousedown", e => e.stopPropagation());

  // -----------------
  // FEATURE HANDLING
  // -----------------
  document.querySelectorAll(".feature_btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const feature = btn.innerText;
      const selectedText = window.getSelection().toString().trim();

      chatTitle.innerText = feature;
      chatbox.classList.add("open");
      featurePanel.style.display = "none";

      chatInput.style.display = "none";
      chatMessages.style.display = "none";
      resultView.innerHTML = "";

      if (feature === "Research") {
        chatInput.style.display = "flex";
        chatMessages.style.display = "block";
        resultView.innerHTML =
          `<p style="opacity:0.7">${selectedText || "Ask anything freely."}</p>`;
      } else {
        if (!selectedText) {
          resultView.innerHTML = "<p>Please select text first.</p>";
        } else {
          resultView.innerHTML =
            `<h4>${feature}</h4><p>${selectedText.slice(0,300)}...</p>`;
        }
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    chatbox.classList.remove("open");
  });

  console.log("SmAs.AI widget initialized");
}
