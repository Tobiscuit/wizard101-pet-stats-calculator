# Agent Workflow Toolkit

Portable AI agent workflows for bleeding-edge UI/UX development.

## Quick Start

1. Copy this folder's contents to your project's `.agent/` directory
2. Run `/detect-stack` to generate `project-context.json`
3. Use any workflow!

## Workflows

| Workflow | Description |
|----------|-------------|
| `/detect-stack` | Scan project and generate `project-context.json` |
| `/bleeding-edge-audit` | Full modernization pass with latest patterns |
| `/affordance-audit` | Find UI elements that look interactive but aren't |

## Files

```
agent-workflow-toolkit/
├── README.md                      # This file
├── project-context.template.json  # Template for new projects
├── detect-stack.md                # Stack detection workflow
├── bleeding-edge-audit.md         # Bleeding-edge modernization
├── affordance-audit.md            # False affordance detection
└── CLI-PLAN.md                    # Future Go CLI plan
```

## Usage

### Option A: Manual Copy
```bash
cp -r agent-workflow-toolkit/ my-project/.agent/
cd my-project
# Run /detect-stack
```

### Option B: Git Submodule (if in its own repo)
```bash
git submodule add <repo-url> .agent/workflows-shared
```

### Option C: Future Go CLI
See `CLI-PLAN.md` for the vision.

---

## Stack Compatibility

Workflows are designed to be stack-agnostic. They read `.agent/project-context.json` and adapt research/implementation to your specific stack:

- React / Next.js / Vite / Nuxt
- Tailwind CSS (any version)
- Shadcn UI / Radix / MUI / Chakra
- TypeScript / JavaScript

---

## Contributing

1. Add new workflows to this folder
2. Update README
3. Test in a real project
4. Commit to your private repo
