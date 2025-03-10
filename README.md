# API Agent

![API Agent Screenshot](screenshot.webp)

API Agent is an interactive web application that allows users to query APIs through natural language. It translates user questions into API calls, fetches real-time data, and presents the results in a user-friendly format.

## Features

- **Natural Language Interface**: Ask questions in plain English to interact with APIs
- **Multiple API Support**: Connect to GitHub, StackOverflow, Jira, and more
- **Real-time Data**: Access up-to-date information from various platforms
- **Code Generation**: Automatically generates and executes JavaScript code for API calls
- **Result Validation**: Verifies that the results answer the original question
- **Dark/Light Mode**: Supports theme switching for comfortable viewing
- **Token Management**: Securely store API tokens for authenticated requests

## Usage

1. Enter your question in the input field (e.g., "What are the trending Python repositories this week?")
2. Click "Submit" to process your request
3. View the step-by-step process:
   - Developer analysis of required API endpoints
   - Generated code to fetch the data
   - Results from the API call
   - Validation of the results

### Example Questions

- What are the most starred JavaScript repositories on GitHub?
- What are the most recent questions about React on StackOverflow?
- Who are the top contributors to the TensorFlow repository?
- What are the trending Python repositories this week?
- What are the most upvoted JavaScript questions on StackOverflow?

## Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- API tokens (optional, but recommended for higher rate limits):
  - [GitHub Token](https://github.com/settings/tokens)
  - [StackOverflow Token](https://stackapps.com/apps/oauth/register)
  - [Jira Token](https://id.atlassian.com/manage-profile/security/api-tokens)

### Local Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Log in to LLM Foundry when prompted
4. (Optional) Add your API tokens in the "API Tokens" section

## Deployment

The application can be deployed to any static web hosting service:

1. Upload all files to your web server
2. Ensure CORS is properly configured for API requests
3. Set up proper authentication for the LLM Foundry service

## Technical Details

### Architecture

API Agent uses a client-side architecture with the following components:

- **Frontend**: HTML, CSS (Bootstrap), and JavaScript
- **LLM Integration**: Connects to LLM Foundry for natural language processing
- **API Connector**: Dynamically generates and executes JavaScript to call external APIs
- **Result Renderer**: Formats and displays results using lit-html and marked

### Dependencies

- [Bootstrap 5.3.3](https://getbootstrap.com/) - UI framework
- [lit-html 3](https://lit.dev/) - HTML templating library
- [asyncLLM 2](https://github.com/gramener/asyncllm) - Streaming LLM responses
- [marked 13](https://marked.js.org/) - Markdown parsing
- [highlight.js 11](https://highlightjs.org/) - Syntax highlighting

## License

[MIT](LICENSE)
