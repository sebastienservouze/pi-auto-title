# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-21

### Added

- Extension that automatically names a Pi session from its first user prompt.
- Automatic selection of the cheapest available model.
- Non-blocking title generation (fire-and-forget).
- Language-aware titling: the title is generated in the same language as the prompt.
- Customizable extra guidance via `PI_AUTO_TITLE_PROMPT` environment variable.
- Notification on rename with title, model name, and elapsed time.
- Notification on rename showing title, model name, and duration.
