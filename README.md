# HTML to Image — OpenClaw Plugin

Generate PNG images from HTML content or public URLs using the [PDFAPIHub](https://pdfapihub.com) API. This OpenClaw plugin gives your AI agent the ability to create images, screenshots, and Chart.js charts programmatically.

## What It Does

Render any HTML/CSS into a PNG image, capture website screenshots, generate data visualization charts, and compress images — all through simple agent commands.

### Features

- **HTML to Image** — Render HTML/CSS to PNG with custom dimensions
- **URL Screenshots** — Capture any webpage as a PNG image
- **Retina Quality** — 2x/3x device scale factor for crisp output
- **Full-Page Screenshots** — Capture the entire scrollable page
- **Cookie Consent** — Auto-click cookie banners before capturing
- **Google Fonts** — Load any Google Font for HTML rendering
- **Dynamic Placeholders** — Replace `{{name}}`, `{{title}}` with real data
- **Chart Generation** — Create bar, line, pie, doughnut, radar, scatter charts using Chart.js
- **Image Compression** — Compress images to JPEG with quality control and stats
- **Multiple Output Formats** — Download URL, base64 string, or raw PNG file

## Tools

| Tool | Description |
|------|-------------|
| `html_to_image` | Generate a PNG from HTML or URL with full customization |
| `compress_image` | Compress images to JPEG with quality control |
| `generate_chart` | Create chart images using Chart.js (bar, line, pie, etc.) |
| `url_to_html` | Fetch fully-rendered HTML from a URL |

## Installation

```bash
openclaw plugins install clawhub:html-image
```

## Configuration

Add your API key in `~/.openclaw/openclaw.json`:

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

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

## Usage Examples

Just ask your OpenClaw agent:

- *"Create a social media card (1200x630) with title 'My Blog Post' on a gradient background"*
- *"Take a full-page screenshot of https://news.ycombinator.com"*
- *"Generate a bar chart of quarterly revenue: Q1=$120k, Q2=$150k, Q3=$180k, Q4=$200k"*
- *"Compress this image to 75% quality"*

## Use Cases

- **Social Media Cards** — Generate OG images, Twitter cards, Instagram stories
- **Email Banners** — Create personalized email header images
- **Website Screenshots** — Capture live websites for monitoring or previews
- **Data Visualization** — Generate charts for reports, dashboards, or emails
- **Thumbnail Generation** — Create consistent thumbnails for blog posts
- **Product Mockups** — Generate product images with dynamic text overlays
- **Certificate Images** — Render certificates as shareable images

## API Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)

## License

MIT
