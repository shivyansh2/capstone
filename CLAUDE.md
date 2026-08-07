# Project Conventions

This file gives AI assistants (Claude Code, Blackbox AI, Cursor) the context
they need to work effectively in this repository.

## Stack

- **Runtime:** Node.js (LTS)
- **Language:** JavaScript (CommonJS for now)
- **Package manager:** npm
- **Test runner:** TBD (to be decided with project scope)

## Repository layout

```
capstone/
├── CLAUDE.md      # AI assistant conventions (this file)
├── LICENSE        # MIT license
├── README.md      # Project overview and status
├── package.json   # npm manifest
├── src/           # Application source
│   └── index.js   # Entry point
```

## Git workflow

- **Commit format:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
  - Format: `<type>(<scope>): <description>`
  - Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, `revert`
  - Example: `feat(auth): add login endpoint`
- **Branches:** feature branches off `main`; merge via pull request once a remote is configured.
- **Commits:** small, atomic commits with a single logical change each.

## Code conventions

- 2-space indentation, single quotes, semicolons.
- Prefer small, single-purpose functions and modules.
- Use `const` by default; `let` only when rebinding is required.
- Handle errors explicitly; fail fast with clear messages.

## Commands

| Command          | Purpose                 |
| ---------------- | ----------------------- |
| `npm start`      | Run the application     |
| `npm test`       | Run tests (once added)  |

## AI assistant notes

- Keep changes minimal and scoped to the task.
- Prefer readable code over clever one-liners.
- When in doubt, ask the user rather than guessing project scope.

