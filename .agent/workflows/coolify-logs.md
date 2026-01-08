---
description: Stream and filter Coolify deployment logs to show only Next.js build errors
---

# Coolify Build Log Streamer

Stream deployment logs from Coolify, filtered to show only Next.js build output.

## Prerequisites

1. Add your Coolify API token to `frontend/.env.local`:
```
COOLIFY_API_TOKEN="your-token-here"
COOLIFY_APP_UUID="cs4ks0oco4s0kccog8ggsggs"
```

To get your API token:
- Go to Coolify UI → Settings → Keys & Tokens → API Tokens
- Create a new token with read access

## Usage

### One-time check (after deployment)
```powershell
// turbo
.\tools\coolify-logs.ps1
```

### Watch mode (live updates)
```powershell
// turbo
.\tools\coolify-logs.ps1 -Watch
```

### Local build check (before pushing)
```powershell
// turbo
cd frontend && npm run build:check
```

## What it shows

- Only Next.js build output (filtered by delimiters or patterns)
- Color-coded errors (red), warnings (yellow), success (green)
- Clean timestamps stripped for readability
