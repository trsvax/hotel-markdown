#!/bin/bash
# setup-steering.sh
# Symlink steering files into Kiro and VS Code Copilot user-level locations.
#
# Usage: ./setup-steering.sh /path/to/steering/repo
#
# Example: ./setup-steering.sh ~/github/theTube/hotel-markdown

STEERING_REPO="${1:?Usage: $0 /path/to/steering/repo}"
STEERING_DIR="$STEERING_REPO/steering"

if [ ! -d "$STEERING_DIR" ]; then
  echo "Error: $STEERING_DIR not found"
  exit 1
fi

# --- Kiro ---
KIRO_DIR="$HOME/.kiro/steering"
mkdir -p "$KIRO_DIR"

for file in "$STEERING_DIR"/*.md; do
  [ -f "$file" ] || continue
  ln -sf "$file" "$KIRO_DIR/$(basename "$file")"
  echo "Kiro: $(basename "$file")"
done

# --- VS Code Copilot ---
# User-level instructions file (concatenate all steering into one)
COPILOT_FILE="$HOME/copilot-instructions.md"
echo "# Personal Instructions" > "$COPILOT_FILE"
echo "" >> "$COPILOT_FILE"
for file in "$STEERING_DIR"/*.md; do
  [ -f "$file" ] || continue
  # Strip frontmatter
  sed '1{/^---$/,/^---$/d}' "$file" >> "$COPILOT_FILE"
  echo "" >> "$COPILOT_FILE"
done
echo "VS Code: $COPILOT_FILE"

echo "Done."
