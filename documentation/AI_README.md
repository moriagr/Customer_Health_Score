## 🤖 AI Collaboration Evidence
This project was developed with the support of an AI tool (ChatGPT, Claude, Copilot, deep ai ), which assisted in debugging, research, and improving implementation decisions. Below is the documentation of how AI was used and iterated upon:

### 1. Documentation of AI Tool Usage
AI was used to:
- **Frontend**: Debug React errors (e.g., invalid React children), design UI components (Loading spinner, ErrorBox, CustomButton, ProgressBar), and improve error/loading handling with a reusable wrapper.
- **Backend**: Understand and refine the logic behind **health score functions**, decide the best structure for backend endpoints, and debug issues like **CORS**, **req.body being undefined**, and Express router errors.


### 2. Quality of Research and Implementation Decisions
AI provided guidance that influenced important implementation choices:
- **Error & Loading Handling**: Suggested a wrapper component (`DataWrapper`) to manage loading, error, and empty states consistently.
- **Code Organization**: Recommended using CSS Modules (`ErrorBox.module.css`, `CustomButton.module.css`) and separating UI logic from design.
- **Backend Design**: Provided insights on the **best way to implement health score calculations**, how to structure Express routes, and how to handle errors properly in API responses.
- **Debugging**: Helped trace CORS issues in Express, offering fixes that aligned with production-ready standards.


### 3. Evidence of Iterating on AI Suggestions
The project evolved through several refinement cycles with AI support:
- **Frontend**:
  - Started with inline styles → extracted into **CSS Modules** after AI’s suggestion.
  - Repeated loading/error handling → refactored into a **reusable wrapper component**.
  - Plain "Back" button → redesigned into a **custom gradient button** with hover effects and modular styling.
  - ProgressBar, Loading, and ErrorBox went through multiple iterations for design improvements and separation of concerns.
- **Backend**:
  - Iterated on the **health score function design**, refining the weighting of tickets, invoices, and events.
  - Improved Express **endpoint design** for customer detail and dashboard routes.
  - Debugged request handling issues, moving from basic functions to **cleaner, maintainable service functions**.
  - Ensured correct **error handling** and response formatting across endpoints.
