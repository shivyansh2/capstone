# Project Conventions

This file gives AI assistants (Claude Code, Blackbox AI, Cursor) the context
they need to work effectively in this repository.

## Stack

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript
- **Framework:** React 18+
- **Package manager:** npm
- **Test runner:** Jest + React Testing Library
- **Form validation:** react-hook-form + Zod
- **Styling:** CSS Modules

## Repository layout

```
capstone/
├── CLAUDE.md              # AI assistant conventions & rules (this file)
├── WORKFLOW.md            # Development workflow documentation
├── LICENSE                # MIT license
├── README.md              # Project overview and status
├── package.json           # npm manifest
├── src/                   # Application source
│   ├── components/        # React components
│   │   ├── SettingsForm.tsx
│   │   ├── SettingsForm.module.css
│   │   └── __tests__/
│   │       └── SettingsForm.test.tsx
│   └── index.tsx          # Entry point
```

## Git workflow

- **Commit format:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
  - Format: `<type>(<scope>): <description>`
  - Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, `revert`
  - Example: `feat(auth): add login endpoint`
- **Branches:** feature branches off `main`; merge via pull request once a remote is configured.
- **Commits:** small, atomic commits with a single logical change each.

## Code conventions

- 2-space indentation, single quotes, semicolons
- Prefer small, single-purpose functions and modules
- Use `const` by default; `let` only when rebinding is required
- Handle errors explicitly; fail fast with clear messages
- Use TypeScript strict mode

## Form Development Rules (Testable & Project-Specific)

### Rule 1: All Forms Use react-hook-form + Zod, Never Uncontrolled `useState`

**Why:** Manual state management causes dual sources of truth (data + errors → sync bugs), brittle validation (e.g., `email.includes('@')` accepts invalid formats), and missing undo/reset.

**What to do:**
1. Define schema with Zod *before* writing JSX
2. Use `useForm()` with `zodResolver`
3. Set validation mode to `'onBlur'` (reduce noise) or `'onChange'` (real-time)
4. Never use `useState` for form fields; use `register()` and `formState`

**Example:**
```typescript
// ✅ Correct
const schema = z.object({ email: z.string().email('Invalid email format') });
const { register, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

// ❌ Wrong
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});
```

**Testable:**
- [ ] All form components import `useForm` from 'react-hook-form'
- [ ] All form schemas defined as Zod objects (never manual validation)
- [ ] No uncontrolled `useState` for form fields
- [ ] Linter flag: `useState` inside form components = warning

**Reference:** `src/components/SettingsForm.tsx` (Round 2 implementation)

---

### Rule 2: All Interactive Elements Must Have Visible Focus States; Never `outline: none` Without Replacement

**Why:** WCAG 2.1 Level AA compliance; keyboard users depend on it. Round 1 had zero focus styling.

**What to do:**
1. Use `:focus-visible` (targets keyboard, not mouse)
2. Provide min 3px visible indicator (box-shadow ring preferred; border/outline acceptable)
3. Ensure ≥ 3:1 contrast with background
4. Test focus order with keyboard Tab

**Example:**
```css
/* ✅ Correct */
.input:focus-visible {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1); /* 3px visible */
}

/* ❌ Wrong */
.input:focus { outline: none; } /* User can't see focus */
```

**Testable:**
- [ ] All `input`, `button`, `select`, `textarea`, `[role="button"]` have `:focus-visible`
- [ ] Focus indicator ≥ 2px, ideally 3px
- [ ] Contrast ratio ≥ 3:1 (verify with axe DevTools/WAVE)
- [ ] Tab through form; every interactive element visibly focused

**Reference:** `src/components/SettingsForm.module.css` `.input:focus-visible` and `.checkbox:focus-visible`

---

### Rule 3: Error Messages Must Be Linked to Inputs via `aria-describedby`; Errors Never Orphaned

**Why:** Screen reader users depend on error association. Round 1 errors were orphaned; Round 2's tests caught missing `aria-describedby`.

**What to do:**
1. Every error `<span>` gets unique ID: `id={fieldName + '-error'}`
2. Every input with possible error gets conditional `aria-describedby`
3. Only set `aria-describedby` when error exists (avoid pointing to non-existent element)

**Example:**
```typescript
// ✅ Correct
{errors.email && (
  <span id="email-error" className={styles.error}>
    {errors.email.message}
  </span>
)}
<input
  aria-describedby={errors.email ? 'email-error' : undefined}
  {...register('email')}
/>

// ❌ Wrong
<span>{errors.email}</span>
<input /> {/* no aria-describedby; orphaned error */}
```

**Testable:**
- [ ] Every error-able input has unique error ID
- [ ] Conditional `aria-describedby={errors.field ? 'id' : undefined}`
- [ ] No orphaned error messages
- [ ] Screen reader test: VoiceOver/NVDA announces error when input focused

**Reference:** `src/components/SettingsForm.tsx` lines 85–92

---

## Form Code Review Checklist

Use this template for all form component PRs:

- [ ] **Validation:** Zod schema exists; no manual validation
- [ ] **Email:** Uses Zod `.email()`, not custom regex
- [ ] **Focus:** All interactive elements have `:focus-visible` with 3px indicator
- [ ] **Labels:** All `<input>` has `<label htmlFor="id">`
- [ ] **Error linking:** Unique error IDs; input has conditional `aria-describedby`
- [ ] **Keyboard nav:** Tab through entire form; all interactive elements reachable & visible
- [ ] **Tests:** Empty fields, invalid email, successful submit, reset covered
- [ ] **Styling:** CSS Modules, no inline `style={{ }}`

---

## Commands

| Command                | Purpose                            |
| ---------------------- | ---------------------------------- |
| `npm start`            | Run dev server                     |
| `npm test`             | Run Jest tests                     |
| `npm test -- --watch`  | Run tests in watch mode            |
| `npm test -- --coverage` | Generate coverage report         |
| `npm run lint`         | Run ESLint (if configured)         |

## Prompting Guidelines (AI Assistants)

**When building forms:**
1. Reference this file's Rules 1–3 in your mental model
2. Always include test cases covering: empty fields, invalid formats, successful submit
3. Use CSS Modules (never inline styles)
4. Build accessibility (labels, aria-describedby, focus states) from the start, not after

**Vague vs. Precise Prompts:**
- Vague ("build a form") → bugs, rework cycles, accessibility gaps
- Precise (file paths, constraints, example behavior, verification step) → production-ready code, zero rework

See `WORKFLOW.md` for full case study.

## AI Assistant Notes

- Keep changes minimal and scoped to the task
- Prefer readable code over clever one-liners
- When in doubt, ask the user rather than guessing project scope
- **For forms:** Always use react-hook-form + Zod; never `useState` for form state
- **For styles:** Use CSS Modules; include focus states from the start
- **For accessibility:** All interactive elements need `:focus-visible` and proper ARIA attributes

---

## Resources

- **WORKFLOW.md:** Full comparison of vague vs. precise prompting (this project's case study)
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **WCAG 2.1 Focus Visible:** https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html
- **aria-describedby:** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby

---

**Last updated:** 2026-08-19  
**Key lessons:** See `WORKFLOW.md` § Lessons Learned
