# Transcriptions Directory

This directory contains transcriptions of seminars, video talks, conferences, webinars, and other spoken content related to the SORA ecosystem.

## Purpose

Transcriptions provide searchable, indexed access to valuable information from video and audio content. These documents are indexed in the Knowledge Base with **Authority Level 3** (supplemental, similar to community memos).

## Authority Level

- **Level 3 (Neutral)**: Transcriptions are treated as supplemental material
- They provide context but never override Level 1 (BCK papers, internal research) or Level 2 (official docs/wiki) sources
- Used for background information and accessible reference to spoken content

## Directory Structure

Transcriptions are organized by year, with optional event type subdirectories for better organization:

```
transcriptions/
├── 2023/
│   ├── conferences/
│   │   └── sora-summit-2023-keynote.md
│   ├── seminars/
│   │   └── iroha-consensus-seminar.md
│   └── talks/
│       └── sora-v3-roadmap-talk.md
├── 2024/
│   ├── conferences/
│   ├── seminars/
│   ├── talks/
│   └── webinars/
│       └── polkaswap-tutorial-webinar.md
└── 2025/
    ├── conferences/
    ├── seminars/
    ├── talks/
    └── webinars/
```

**Organization Guidelines:**
- **Primary organization**: By year (e.g., `2024/`, `2025/`)
- **Optional subdirectories**: By event type (e.g., `conferences/`, `seminars/`, `talks/`, `webinars/`)
- For small collections, you can place files directly in year folders
- For larger collections, use event type subdirectories to keep things organized

## File Naming Conventions

### Format
- Use kebab-case: `event-name-or-title.md`
- Include date if helpful: `sora-summit-2024-09-15.md`
- Include event type if not in subdirectory: `conference-sora-summit-2024.md`

### Examples
- ✅ `sora-v3-roadmap-talk.md`
- ✅ `iroha-consensus-seminar-2024.md`
- ✅ `polkaswap-tutorial-webinar.md`
- ✅ `tokyo-blockchain-conference-2024.md`
- ❌ `SORA V3 Talk.md` (spaces, uppercase)
- ❌ `sora_v3_talk.md` (underscores)
- ❌ `sora.v3.talk.md` (dots)

## Frontmatter Template

All transcription files MUST include proper frontmatter. Use this template:

```yaml
---
title: "SORA v3 Roadmap Talk"
slug: "sora-v3-roadmap-talk"
source: "transcription"
source_url: "https://youtube.com/watch?v=example"  # Original video/audio URL
publishDate: "2024-09-15T14:00:00Z"  # Date of the event/talk
content_sha256: ""  # Will be computed during ingestion
snapshot_id: "2024-09-15"  # YYYY-MM-DD format
event_type: "talk"  # Optional: conference, seminar, talk, webinar, etc.
event_name: "SORA Community Meetup"  # Optional: name of the event
speakers: ["Speaker Name"]  # Optional: array of speaker names
venue: "Tokyo, Japan"  # Optional: location of event
tags: ["sora", "sora-v3", "roadmap", "governance"]  # Optional: relevant tags
transcription_date: "2024-09-20T10:00:00Z"  # Optional: when transcription was created
transcriber: "Soranauts Team"  # Optional: who created the transcription
video_duration: "45:30"  # Optional: duration of original video/audio
---
```

### Required Fields

- `title`: Human-readable title of the transcription
- `slug`: Kebab-case unique identifier (matches filename without extension)
- `source`: Must be `"transcription"`
- `source_url`: URL to original video/audio (YouTube, Vimeo, etc.) or internal reference
- `publishDate`: ISO 8601 datetime of when the event/talk occurred
- `content_sha256`: Will be computed during ingestion (can be empty initially)
- `snapshot_id`: YYYY-MM-DD format (date of the event)

### Optional Fields

- `event_type`: Type of event (conference, seminar, talk, webinar, workshop, etc.)
- `event_name`: Name of the event or series
- `speakers`: Array of speaker names
- `venue`: Location where event took place
- `tags`: Array of relevant tags for searchability
- `transcription_date`: When the transcription was created
- `transcriber`: Who created the transcription
- `video_duration`: Duration of original content (HH:MM:SS or MM:SS format)
- `updateDate`: Last update datetime (if transcription is revised)
- `language`: Language of the transcription (en, ja, zh, etc.)

## Content Guidelines

### Transcription Quality

- **Accuracy**: Strive for accurate transcription of spoken content
- **Formatting**: Use markdown formatting for readability:
  - Headers for major sections
  - Bold/italic for emphasis
  - Code blocks for technical terms or commands
  - Lists for enumerated points
- **Speaker Identification**: Use speaker labels when multiple speakers:
  ```
  **Speaker 1:** Welcome everyone to today's talk.
  
  **Speaker 2:** Thank you. Let's begin with an overview.
  ```
- **Timestamps**: Optionally include timestamps for key moments:
  ```
  [00:15:30] **Speaker:** Now let's discuss the roadmap.
  ```

### Metadata Preservation

- Always include the original source URL
- Note if transcription is verbatim or edited/summarized
- Include any relevant context about the event

## Examples

### Example 1: Conference Talk

**File**: `2024/conferences/sora-summit-2024-keynote.md`

```yaml
---
title: "SORA Summit 2024 Keynote Address"
slug: "sora-summit-2024-keynote"
source: "transcription"
source_url: "https://youtube.com/watch?v=abc123"
publishDate: "2024-09-15T10:00:00Z"
content_sha256: ""
snapshot_id: "2024-09-15"
event_type: "conference"
event_name: "SORA Summit 2024"
speakers: ["Makoto Takemiya", "Kazumasa Inaba"]
venue: "Tokyo, Japan"
tags: ["sora", "sora-v3", "keynote", "roadmap"]
transcription_date: "2024-09-16T08:00:00Z"
transcriber: "Soranauts Team"
video_duration: "1:15:30"
---
```

### Example 2: Technical Seminar

**File**: `2024/seminars/iroha-consensus-deep-dive.md`

```yaml
---
title: "Iroha Consensus Deep Dive Seminar"
slug: "iroha-consensus-deep-dive"
source: "transcription"
source_url: "https://vimeo.com/example"
publishDate: "2024-10-20T14:00:00Z"
content_sha256: ""
snapshot_id: "2024-10-20"
event_type: "seminar"
speakers: ["Iroha Team"]
tags: ["iroha", "consensus", "technical"]
---
```

## Retrieval Behavior

Transcriptions appear in retrieval results as supplemental context. They will:
- Never outrank Level 1–2 sources on the same topic
- Provide accessible reference to spoken content
- Support understanding of ecosystem developments and community discussions
- Enable searchability of video/audio content

## Best Practices

1. **Consistency**: Use consistent naming and organization patterns
2. **Metadata**: Include as much metadata as possible for better searchability
3. **Quality**: Ensure transcriptions are accurate and well-formatted
4. **Source Links**: Always include links to original content
5. **Tags**: Use relevant tags to improve discoverability
6. **Year Organization**: Always place files in the appropriate year folder

## Adding Transcriptions

1. **Create the file** in the appropriate year folder (and optional event type subdirectory)
2. **Add frontmatter** using the template above
3. **Write the transcription** with proper markdown formatting
4. **Include metadata** about the event, speakers, and source
5. **Test ingestion** locally to ensure proper indexing

The ingestion pipeline will automatically:
- Validate frontmatter
- Compute content hash
- Index for retrieval
- Apply Authority Level 3




