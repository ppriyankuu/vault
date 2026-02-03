package cmd

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var searchCmd = &cobra.Command{
	Use:     "search <query>",
	Example: "\tsearch process\n\tsearch dbms/normalization",
	Short:   "Search notes",
	Args:    cobra.ExactArgs(1),
	RunE:    searchCommand,
}

func searchCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	query := args[0]
	var outputLines []string

	// Try ripgrep first
	rg, err := exec.LookPath("rg")
	if err == nil {
		// Search in file names
		globCmd := exec.Command(rg, "--files", "--glob", "*"+query+"*", cfg.Root)
		if globOut, err := globCmd.Output(); err == nil && len(globOut) > 0 {
			outputLines = append(outputLines, strings.Split(strings.TrimSpace(string(globOut)), "\n")...)
		}

		// Search in file contents (filename only mode with -l)
		contentCmd := exec.Command(rg, "-i", "-l", query, cfg.Root)
		if contentOut, err := contentCmd.Output(); err == nil && len(contentOut) > 0 {
			lines := strings.Split(strings.TrimSpace(string(contentOut)), "\n")
			for _, line := range lines {
				// Avoid duplicates
				found := slices.Contains(outputLines, line)
				if !found {
					outputLines = append(outputLines, line)
				}
			}
		}
	} else {
		// Fallback to find + grep
		// Search in file names with find
		findCmd := exec.Command("find", cfg.Root, "-type", "f", "-name", "*"+query+"*")
		if findOut, err := findCmd.Output(); err == nil && len(findOut) > 0 {
			lines := strings.SplitSeq(strings.TrimSpace(string(findOut)), "\n")
			for line := range lines {
				outputLines = append(outputLines, line)
			}
		}

		// Search in file contents with grep
		grepCmd := exec.Command("grep", "-r", "-i", "-l", query, cfg.Root)
		if grepOut, err := grepCmd.Output(); err == nil && len(grepOut) > 0 {
			lines := strings.SplitSeq(strings.TrimSpace(string(grepOut)), "\n")
			for line := range lines {
				// Avoid duplicates
				found := slices.Contains(outputLines, line)
				if !found {
					outputLines = append(outputLines, line)
				}
			}
		}
	}

	if len(outputLines) == 0 {
		return fmt.Errorf("no matches found for '%s'", query)
	}

	// Convert absolute paths to relative paths (from vault root)
	var relativePaths []string
	for _, line := range outputLines {
		if rel, err := filepath.Rel(cfg.Root, line); err == nil {
			// Remove .txt extension for display
			rel = strings.TrimSuffix(rel, ".txt")
			relativePaths = append(relativePaths, rel)
		}
	}

	// Display results
	for _, relPath := range relativePaths {
		fmt.Println(relPath)
	}

	// Copy first result to clipboard if available
	if len(relativePaths) > 0 {
		copyToClipboard(relativePaths[0])
	}

	return nil
}

func copyToClipboard(text string) {
	var cmd *exec.Cmd

	if _, err := exec.LookPath("pbcopy"); err == nil {
		cmd = exec.Command("pbcopy")
	} else if _, err := exec.LookPath("xclip"); err == nil {
		cmd = exec.Command("xclip", "-selection", "clipboard")
	} else if _, err := exec.LookPath("xsel"); err == nil {
		cmd = exec.Command("xsel", "--clipboard", "--input")
	} else if _, err := exec.LookPath("wl-copy"); err == nil {
		cmd = exec.Command("wl-copy")
	} else if _, err := exec.LookPath("clip.exe"); err == nil {
		cmd = exec.Command("clip.exe")
	}

	if cmd != nil {
		cmd.Stdin = strings.NewReader(text)
		if err := cmd.Run(); err == nil {
			fmt.Printf("\n✓ path copied to clipboard: %s\n", text)
		}
	}
}

func init() {
	rootCmd.AddCommand(searchCmd)
}
