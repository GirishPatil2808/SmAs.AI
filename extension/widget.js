// to make widget draggable

const widget = document.getElementById("widget");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Mouse down → start drag
widget.addEventListener("mousedown", (e) => {
  isDragging = true;

  const rect = widget.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  widget.style.cursor = "grabbing";
});

// Mouse move → drag
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  widget.style.left = `${x}px`;
  widget.style.top = `${y}px`;

  widget.style.right = "auto";
  widget.style.bottom = "auto";
});

// Mouse up → stop drag
document.addEventListener("mouseup", () => {
  isDragging = false;
  widget.style.cursor = "grab";
});


// To open feature panel after clicking widget button

const askBtn = document.getElementById("widget_button");
const featurePanel = document.getElementById("feature_panel");

askBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const isOpen = featurePanel.style.display === "flex";
  featurePanel.style.display = isOpen ? "none" : "flex";
});

document.addEventListener("click", () => {
  featurePanel.style.display = "none";
});
// To stop dragging after btn clicked

featurePanel.addEventListener("mousedown", (e) => {
  e.stopPropagation();
});


// For Transparent chatbox

const chatbox = document.getElementById("chatbox");
const chatTitle = document.getElementById("chat_title");
const closeBtn = document.getElementById("chat_close");

document.querySelectorAll(".feature_btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const feature = btn.innerText;

    chatTitle.innerText = feature;
    chatbox.classList.add("open");

    // close feature panel
    featurePanel.style.display = "none";
  });
});

closeBtn.addEventListener("click", () => {
  chatbox.classList.remove("open");
});

chatbox.addEventListener("mousedown", (e) => {
  e.stopPropagation();
});
