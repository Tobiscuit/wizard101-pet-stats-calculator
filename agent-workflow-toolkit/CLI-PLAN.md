# Go CLI Plan: `agentkit`

A CLI tool to bootstrap and manage AI agent workflows across projects.

---

## Vision

```bash
# Initialize in a new project
agentkit init

# Detect and generate project context
agentkit detect

# List available workflows
agentkit list

# Update workflows from source
agentkit update
```

---

## Features

### `agentkit init`
- Creates `.agent/` directory structure
- Copies workflow templates
- Runs initial stack detection
- Prompts for missing info

### `agentkit detect`
- Scans project files (package.json, tsconfig, etc.)
- Generates/updates `.agent/project-context.json`
- Shows summary of detected stack

### `agentkit list`
- Lists all available workflows
- Shows which are installed vs available
- Displays descriptions

### `agentkit update`
- Pulls latest workflow versions from source
- Merges with local customizations
- Backs up before overwriting

---

## Architecture

```
agentkit/
├── cmd/
│   ├── root.go
│   ├── init.go
│   ├── detect.go
│   ├── list.go
│   └── update.go
├── internal/
│   ├── detector/       # Stack detection logic
│   ├── templates/      # Embedded workflow templates
│   └── config/         # Config management
├── templates/
│   ├── workflows/      # .md workflow files
│   └── context.json    # Template context file
├── go.mod
├── go.sum
└── main.go
```

---

## Stack Detection Logic (Go)

```go
type ProjectContext struct {
    Name             string            `json:"name"`
    Framework        string            `json:"framework"`
    FrameworkVersion string            `json:"frameworkVersion"`
    Language         string            `json:"language"`
    Styling          StylingConfig     `json:"styling"`
    Animations       []string          `json:"animations"`
    Features         map[string]string `json:"features"`
    DetectedAt       time.Time         `json:"detectedAt"`
    LastUpdated      time.Time         `json:"lastUpdated"`
}

func DetectStack(projectPath string) (*ProjectContext, error) {
    ctx := &ProjectContext{}
    
    // Check package.json
    if pkg, err := readPackageJSON(projectPath); err == nil {
        ctx.Name = pkg.Name
        ctx.Framework = detectFramework(pkg.Dependencies)
        ctx.Styling = detectStyling(pkg)
        ctx.Animations = detectAnimations(pkg)
    }
    
    // Check for TypeScript
    if fileExists(filepath.Join(projectPath, "tsconfig.json")) {
        ctx.Language = "typescript"
    }
    
    // Check for Tailwind version
    if cfg := findFile(projectPath, "tailwind.config.*"); cfg != "" {
        ctx.Styling.CSS = detectTailwindVersion(projectPath)
    }
    
    return ctx, nil
}
```

---

## Distribution Options

### Option 1: Private GitHub Releases
```bash
# Install from private repo
GITHUB_TOKEN=xxx go install github.com/yourname/agentkit@latest
```

### Option 2: Homebrew Tap (private)
```bash
brew tap yourname/tools git@github.com:yourname/homebrew-tools.git
brew install agentkit
```

### Option 3: Direct Binary Download
```bash
curl -L https://your-server.com/agentkit -o /usr/local/bin/agentkit
chmod +x /usr/local/bin/agentkit
```

---

## Security Considerations

- **Private repo:** Keep workflows proprietary
- **Token auth:** Require GitHub token for updates
- **No telemetry:** Zero data collection
- **Local only:** All operations are local

---

## MVP Scope

For v0.1, implement only:
1. `agentkit init` — Copy templates
2. `agentkit detect` — Generate context file

Everything else can come later.

---

## Dependencies

- `cobra` — CLI framework
- `viper` — Config management
- `go-git` — For update functionality
- Standard library for file operations

---

## Estimated Effort

| Task | Time |
|------|------|
| Project setup + cobra scaffolding | 1 hour |
| `init` command | 2 hours |
| `detect` command | 3 hours |
| Embed templates | 1 hour |
| Testing + polish | 2 hours |
| **Total MVP** | **~9 hours** |

---

## Next Steps

1. Create private GitHub repo `agentkit`
2. Scaffold with `cobra-cli init`
3. Embed workflow templates
4. Implement detect logic
5. Build and distribute

---

*This is the dream. Build it when you have a weekend free.* 🚀
