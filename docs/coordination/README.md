# AgeLess: automatic coordination pilot

Scheduled **every six hours** and manually available from GitHub Actions. Checks the current default-branch checkout for checkpoint and coordination files, generates a run summary and a seven-day downloadable artifact.

No API key, additional hosting cost, or external model required within the GitHub Actions free allowance. Usage is still subject to the account's remaining included minutes and GitHub limits.

**Not yet implemented:** autonomous AI reasoning/coding while the chat is closed, direct chat-to-chat messaging, agent task execution, persistent background worker, or actual live-system checks.

To start: merge the reviewed PR containing this workflow into the default branch. Then open Actions > AgeLess Hybrid Coordination > Run workflow. Scheduled runs may be delayed by GitHub and can be automatically disabled after prolonged repository inactivity.

Before promoting this pilot across projects, select an approved AI runtime (cloud free tier with quotas, or a local Ollama host) and make decisions on permissions and spending caps.
