/* globals bootstrap */
import { render, html } from "https://cdn.jsdelivr.net/npm/lit-html@3/+esm";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";
import { asyncLLM } from "https://cdn.jsdelivr.net/npm/asyncllm@2";
import { Marked } from "https://cdn.jsdelivr.net/npm/marked@13/+esm";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js@11/+esm";

// Log in to LLMFoundry
const { token } = await fetch("https://llmfoundry.straive.com/token", { credentials: "include" }).then((res) =>
  res.json()
);
const url = "https://llmfoundry.straive.com/login?" + new URLSearchParams({ next: location.href });
render(
  token
    ? html`<button type="submit" class="btn btn-primary w-100 mt-3">
        <i class="bi bi-arrow-right"></i>
        Submit
      </button>`
    : html`<a class="btn btn-primary w-100 mt-3" href="${url}">Log in to try your own contracts</a></p>`,
  document.querySelector("#submit-task")
);

const request = {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
};

const marked = new Marked();
marked.use({
  renderer: {
    table(header, body) {
      return `<table class="table table-sm">${header}${body}</table>`;
    },
    code(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return /* html */ `<pre class="hljs language-${language}"><code>${hljs
        .highlight(code, { language })
        .value.trim()}</code></pre>`;
    },
  },
});

const $taskForm = document.querySelector("#task-form");
const $results = document.querySelector("#results");

$taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = e.target.task.value;

  let message = {};
  const messages = [{ role: "user", content: task }, message];
  for await (const { content } of asyncLLM("https://llmfoundry.straive.com/openai/v1/chat/completions", {
    ...request,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are an JavaScript API expert.
The user will provide a task.
Explore multiple ways of solving the task using the appropriate API.
Pick the one MOST suited for the task (efficient, easy to implement, simple).
Generate JS code like this:

\`\`\`js
export async function run(params) {
  // ... code to fetch() from the API ...
  // ... code to calculate the result ...
  return result;
}
\`\`\`

The user will call result = await run({GITHUB_TOKEN, JIRA_TOKEN, STACKOVERFLOW_TOKEN}) and share the result.

If the result does not solve the problem, repeat this process.`,
        },
        ...messages,
      ],
    }),
  })) {
    message.assistant = content;
    if (content) renderSteps(messages);
  }
  console.log(messages);

  // Extract the code inside ```js in the last step
  const code = messages[messages.length - 1].assistant.match(/```js(.*)```/s)[1];
  const blob = new Blob([code], { type: "text/javascript" });
  const module = await import(URL.createObjectURL(blob));
  const result = await module.run({
    GITHUB_TOKEN: "#TODO",
  });
  messages.push({ role: "user", content: result });
  renderSteps(messages);

  // Check if the result solves the problem
  let validation = "";
  for await (const { content } of asyncLLM("https://llmfoundry.straive.com/openai/v1/chat/completions", {
    ...request,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You're given a task, and a sequence of (code, result) sets.
Does the final code + result solve the task? Begin with a YES/NO. Then explain why.`,
        },
        ...messages,
      ],
    }),
  })) {
    validation = content;
  }
  messages.at(-1).content += `\n\n${validation}`;
  renderSteps(messages);
});

function renderSteps(steps) {
  render(
    html`${steps.map((step, i) => html`<div class="step">${unsafeHTML(marked.parse(step.content))}</div>`)}`,
    $results
  );
}
