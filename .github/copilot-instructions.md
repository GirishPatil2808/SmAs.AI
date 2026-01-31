# SmAs.AI Copilot Instructions

## Architecture Overview
This project consists of a Chrome extension (Manifest V3) and a Python backend. The extension injects an AI assistant widget onto all websites, allowing users to analyze selected text or ask questions without leaving the page.

### Extension Structure
- `extension/manifest.json`: Defines permissions (activeTab, storage, scripting) and content scripts
- `extension/content.js`: Main logic - injects HTML/CSS, handles widget interactions, drag behavior, and feature selection
- `extension/index.html`: Widget UI with "Ask AI" button, feature panel (Explain/Summarize/Code/Research), and chatbox
- `extension/widget.css`: Styling with high z-index (2147483647) for overlay, backdrop blur effects
- `extension/widget.js`: Unused (logic moved to content.js)
- `extension/config.js`: Contains OpenRouter API key (gitignored)

### Backend Structure
- `backend/main.py`: Currently empty; intended for Python server to handle AI API calls

### Data Flow
1. User selects text on webpage
2. Clicks "Ask AI" → feature panel opens
3. Selects feature (e.g., "Explain") → chatbox slides in from right
4. Extension sends request to backend (not implemented)
5. Backend calls OpenRouter API with prompt
6. Response displayed in chatbox

## Key Patterns
- **Injection Pattern**: Content script fetches HTML from extension resources and appends to document.body
- **Drag Logic**: Manual mousedown/mousemove/mouseup on widget element, updates position styles
- **Feature Handling**: Event listeners on `.feature_btn` elements, conditional logic based on feature type and selected text
- **Styling**: Transparent backgrounds with backdrop-filter blur, fixed positioning with high z-index

## Development Workflows
- **Extension Testing**: Load unpacked extension in Chrome DevTools (no build step)
- **Backend Development**: Implement FastAPI/Flask server in `main.py` to receive POST requests from extension
- **API Integration**: Use OpenRouter client for AI completions; handle rate limits and errors
- **Communication**: Add background service worker to manifest for extension-backend communication, or use fetch to localhost:8000

## Conventions
- All widget logic centralized in `content.js` `initSmAsWidget()` function
- API keys in `config.js` (ensure proper environment handling for production)
- Features: "Explain", "Summarize", "Code", "Research" - Research shows input field, others process selected text
- No automated tests currently; manual testing in browser

## Integration Points
- OpenRouter API for AI responses (configured in `config.js`)
- Extension permissions allow scripting on active tab
- Web accessible resources for HTML/CSS injection

## Common Tasks
- Adding new features: Update HTML buttons, add cases in content.js feature handler
- Styling changes: Modify `widget.css`, test across different websites
- Backend implementation: Create endpoints for each feature, parse requests with text/prompt data