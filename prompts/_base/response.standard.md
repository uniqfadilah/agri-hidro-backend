# Response Standard

Expected format and style for AI-generated responses in this project.

## Format

- Be concise; avoid unnecessary preamble.
- Use markdown for structure (headers, lists, code blocks) when helpful.
- For code changes, show only the relevant diff or snippet unless the full file is needed.

## Style

- Prefer actionable suggestions over vague advice.
- When proposing code, explain the intent in one short sentence if it’s not obvious.
- If something is ambiguous, ask one focused clarifying question instead of guessing.

## Code in Responses

- Use fenced code blocks with the correct language (e.g. `ts`, `json`, `bash`).
- For file paths, use the project-relative path (e.g. `src/app.module.ts`).
- When referencing existing code, cite file and line range when useful.
