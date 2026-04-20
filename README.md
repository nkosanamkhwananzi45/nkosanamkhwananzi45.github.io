# AAC Lint Fix — 43 Issues Resolved

## How to apply

```bash
# 1. Clone / pull your repo
git clone https://github.com/nkosanamkhwananzi45/nkosanamkhwananzi45.github.io.git
cd nkosanamkhwananzi45.github.io

# 2. Copy fix-lint.mjs into the repo root
cp /path/to/fix-lint.mjs .

# 3. Run it (requires Node 18+)
node fix-lint.mjs

# 4. Verify
bun run lint

# 5. Commit
git add -A
git commit -m "fix: resolve all 43 ESLint errors and warnings"
git push
```

---

## Issue Breakdown & Fixes

### A. `@typescript-eslint/no-explicit-any` — 31 instances
**Files:** IntakeForm, IntakeManagement, ProgressUpdates, ProviderPaymentDashboard,
UserManagement, useAssignmentDistribution, useProgressUpdates, useProviderMessaging,
useProviderNotifications, useProviderPayments, webVitals, Book.tsx

**Why it fires:** TypeScript's `any` type disables all type checking and is banned by the rule.

**Fix applied:**
| Pattern found | Replaced with |
|---|---|
| `catch (e: any)` | `catch (e: unknown)` |
| `(error: any)` | `(error: unknown)` |
| `(data: any)` | `(data: Record<string, unknown>)` |
| `Array<any>` | `Array<unknown>` |
| `any[]` | `unknown[]` |
| `Promise<any>` | `Promise<unknown>` |
| Other `any` | `unknown` |

> **Note:** If the compiler then complains about property access on `unknown`, add a type guard
> `if (typeof x === 'object' && x !== null)` or cast `(x as YourType).property`.

---

### B. `@typescript-eslint/no-empty-object-type` — 2 instances
**Files:** `src/components/ui/command.tsx:24`, `src/components/ui/textarea.tsx:5`

**Why it fires:** An `interface Foo extends Bar {}` with no additional members is identical to `Bar`
and is flagged as redundant.

**Fix applied:**
```ts
// Before
interface CommandDialogProps extends React.ComponentPropsWithoutRef<...> {}

// After
type CommandDialogProps = React.ComponentPropsWithoutRef<...>
```

---

### C. `@typescript-eslint/no-require-imports` — 1 instance
**File:** `tailwind.config.ts:106`

**Why it fires:** `require()` is a CommonJS syntax. In a TypeScript + ESM project it is banned.

**Fix applied:**
```ts
// Before (line 106)
plugins: [require("tailwindcss-animate")],

// After
import tailwindcssAnimate from "tailwindcss-animate";
// ...
plugins: [tailwindcssAnimate],
```

---

### D. `react-hooks/exhaustive-deps` (missing dep) — 3 instances
**Files:** `BookingAllocation.tsx:48`, `DeadlineMonitoring.tsx:40`, `IntakeManagement.tsx:59`

**Why it fires:** A function defined inside the component (`fetchBookings`, `fetchDeadlines`,
`fetchIntakes`) is called inside `useEffect` but not listed in the dependency array. The linter
correctly warns this can cause stale-closure bugs.

**Fix applied:** Wrapped each fetch function in `useCallback` so it has a stable reference,
allowing it to be safely included in the `useEffect` deps array:
```ts
// Before
const fetchBookings = async () => { ... };
useEffect(() => { fetchBookings(); }, []);

// After
const fetchBookings = useCallback(async () => { ... }, []);
useEffect(() => { fetchBookings(); }, [fetchBookings]);
```

---

### E. `react-hooks/exhaustive-deps` (useMemo) — 1 instance
**File:** `ProviderMessaging.tsx:37`

**Why it fires:** `const messages = prop?.messages || []` is a logical expression that creates a
new array reference on every render, causing the `useEffect` at line 68 to re-run infinitely.

**Fix applied:** Wrapped in `useMemo`:
```ts
// Before
const messages = prop?.messages || [];

// After
const messages = useMemo(() => prop?.messages || [], [prop?.messages]);
```

---

### F. `react-refresh/only-export-components` — 7 instances
**Files:** badge, button, form, navigation-menu, sidebar, sonner, toggle (all in `ui/`), useAuth

**Why it fires:** These files export both React components **and** non-component values (variant
maps, context, constants). Fast Refresh can only handle pure component files reliably.

**Fix applied for shadcn/ui files:** Added `// eslint-disable-next-line` comment.
This is the recommended approach for shadcn/ui generated files — splitting them would break
shadcn's import convention and is not worth the churn.

**For `useAuth.tsx`:** Same approach. The context provider and hook share a file intentionally.

> To fully eliminate these warnings (optional): move variant/constant exports into separate
> `*-variants.ts` files. The disable comment is functionally equivalent for HMR in practice.

---

## Post-Fix Checklist

- [ ] `bun run lint` returns 0 errors, 0 warnings
- [ ] `bun run build` succeeds
- [ ] Spot-check `unknown` replacements: anywhere you previously used `.someProperty` on an `any`
      value, TypeScript will now flag it — add a type assertion or type guard
- [ ] Test the booking, intake, and deadline components for any regression from `useCallback` wraps
- [ ] Verify `tailwindcss-animate` is in `package.json` dependencies (it should be)
