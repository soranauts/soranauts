#!/bin/bash

# Script to remove manual Table of Contents from all blog posts

echo "Removing manual TOCs from blog posts..."

# Find all .mdx files in the content/post directory
find src/content/post -name "*.mdx" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Use awk to remove TOC sections
    awk '
    BEGIN { in_toc = 0; toc_started = 0 }
    
    # Check if this line starts a TOC section
    /^## Table of Contents/ || /^# Table of Contents/ || /^### Table of Contents/ || /^#### Table of Contents/ || /^##### Table of Contents/ || /^###### Table of Contents/ {
        in_toc = 1
        toc_started = 1
        next
    }
    
    # Check if this line starts a TOC section with emoji
    /^## .*Table of Contents/ || /^# .*Table of Contents/ || /^### .*Table of Contents/ || /^#### .*Table of Contents/ || /^##### .*Table of Contents/ || /^###### .*Table of Contents/ {
        in_toc = 1
        toc_started = 1
        next
    }
    
    # If we are in a TOC section and encounter a horizontal rule or empty line followed by a heading, end TOC
    in_toc && (NF == 0 || /^---+$/ || /^===+$/) {
        in_toc = 0
        next
    }
    
    # If we are in a TOC section and encounter a heading (## or #), end TOC
    in_toc && /^#+ / {
        in_toc = 0
        print $0
        next
    }
    
    # If we are in a TOC section and encounter a list item, skip it
    in_toc && /^[-*+]\s/ {
        next
    }
    
    # If we are in a TOC section and encounter a numbered list item, skip it
    in_toc && /^[0-9]+\.\s/ {
        next
    }
    
    # If we are in a TOC section and encounter a link, skip it
    in_toc && /\[.*\]\(.*\)/ {
        next
    }
    
    # If we are in a TOC section and encounter a horizontal rule, skip it
    in_toc && /^---+$/ {
        next
    }
    
    # If we are in a TOC section and encounter an empty line, skip it
    in_toc && NF == 0 {
        next
    }
    
    # If we are not in a TOC section, print the line
    !in_toc {
        print $0
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file with the processed one
    mv "$temp_file" "$file"
    
    echo "Processed: $file"
done

echo "Manual TOC removal completed!"

