# UI Coding Standards

## Rule

**All UI components must use shadcn/ui exclusively.** No custom UI components are permitted.

## What This Means

- Use components from `src/components/ui/` (shadcn/ui installs here via `npx shadcn@latest add <component>`)
- Do not create custom buttons, inputs, dialogs, cards, etc. — always use the shadcn/ui equivalent
- Do not install other component libraries (Radix primitives are used internally by shadcn/ui and are fine as transitive deps, but should not be used directly in application code)

## Adding Components

Install shadcn/ui components as needed:

```bash
npx shadcn@latest add <component>
# Examples:
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Installed components appear in `src/components/ui/`. Import from there:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
```

## Styling

- Use Tailwind CSS utility classes for layout, spacing, and color — no inline styles
- Use shadcn/ui's built-in variants (e.g., `variant="outline"`, `size="sm"`) before adding custom Tailwind overrides
- Apply additional Tailwind classes via the `className` prop when the built-in variants are insufficient

## What Is Allowed

| Allowed | Not Allowed |
|---|---|
| `src/components/ui/*` (shadcn/ui) | Hand-rolled button, input, modal, etc. |
| Tailwind utility classes | Custom CSS files for components |
| shadcn/ui variants | Other component libraries (MUI, Chakra, etc.) |
| Layout-only wrapper divs | Custom styled wrappers that duplicate shadcn/ui primitives |

## Available Components

See the [shadcn/ui component list](https://ui.shadcn.com/docs/components) for the full catalog. Currently installed in this project:

- `button`
