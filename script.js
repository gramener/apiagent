/* globals bootstrap */
import { render, html } from "https://cdn.jsdelivr.net/npm/lit-html@3/+esm";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";
import { asyncLLM } from "https://cdn.jsdelivr.net/npm/asyncllm@2";
import { Marked } from "https://cdn.jsdelivr.net/npm/marked@13/+esm";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js@11/+esm";

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

  let step = {};
  const steps = [step];
  for await (const { content } of asyncLLM("https://llmfoundry.straive.com/openai/v1/chat/completions", {
    ...request,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Generate JS code for the following task like this:

\`\`\`js
async function run(params) {
  // ... code to fetch() from the API ...
  // ... code to calculate the result ...
  return result;
}
\`\`\`

The user will call result = await run({GITHUB_TOKEN, JIRA_TOKEN, STACKOVERFLOW_TOKEN})`,
        },
        { role: "user", content: task },
      ],
    }),
  })) {
    step.content = content;
    if (content) renderSteps(steps);
  }
});

function renderSteps(steps) {
  render(
    html`${steps.map((step, i) => html`<div class="step">${unsafeHTML(marked.parse(step.content))}</div>`)}`,
    $results
  );
}
