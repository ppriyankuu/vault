# Vault

A `Vim` first CLI notes system.

It helps you create, open, search, and manage notes from the terminal — all edited in `Vim` and synced using `Git`.

Vault is built for people who live in the terminal and want a fast, simple notes workflow.

### Features
- Create and manage notes from the command line
- Open and edit notes directly in Vim
- Keep all notes in a single vault directory
- Search notes by content or name
- Tack note history using Git
- Sync notes across machines using Git

All editing happens in Vim. Vault doesn't use other editors.

### Basic usage
```
vault init        # initialize a vault
vault new         # create a new note
vault list        # list all notes
vault open        # open an existing note in Vim
vault search      # search notes
vault restore     # view git history and restore notes
vault sync        # sync notes using git
```

*For more details*:
```
vault --help
vault [command] --help
```

### Project Structure
```
.
├── cmd/            
│   ├── init.go
│   ├── list.go
│   ├── new.go
│   ├── open.go
│   ├── restore.go
│   ├── root.go
│   ├── search.go
│   └── sync.go
├── internal/       # Core logic (not exposed as CLI)
│   ├── config/     # Vault configuration loading
│   ├── editor/     # Vim editor integration
│   └── notes/      # Notes handling logic
├── main.go         # Application entry point
├── go.mod
├── go.sum
└── README.md
```

#### Philosophy
- Terminal first
- Vim only
- Simple files, no database
- `Git` is the source of truth
