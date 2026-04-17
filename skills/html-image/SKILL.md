---
name: html-image
description: "Generate PNG images from HTML or URLs. Supports custom dimensions, retina quality, full-page screenshots, cookie consent handling, Google Fonts, dynamic placeholders, chart generation, and image compression. Powered by PDFAPIHub."
---

# HTML to Image

Generate PNG images from HTML content or public URLs, create Chart.js charts, and compress images — all via the PDFAPIHub API.

## Tools

| Tool | Description |
|------|-------------|
| `html_to_image` | Generate a PNG from HTML or URL with full customization |
| `compress_image` | Compress images to JPEG with quality control and stats |
| `generate_chart` | Create chart images (bar, line, pie, etc.) using Chart.js |
| `url_to_html` | Fetch rendered HTML from a URL (pre-step for image rendering) |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "html-image": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Or set the environment variable in config: `"env": { "PDFAPIHUB_API_KEY": "your-key" }`

## Usage Examples

**Generate image from HTML:**
> Create a social media card image (1200x630) with title "My Blog Post" on a gradient background

**Screenshot a URL:**
> Take a full-page screenshot of https://example.com in retina quality

**Create a chart:**
> Generate a bar chart showing quarterly revenue: Q1=$120k, Q2=$150k, Q3=$180k, Q4=$200k

**Compress an image:**
> Compress this image to 75% quality: https://pdfapihub.com/sample.png

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
