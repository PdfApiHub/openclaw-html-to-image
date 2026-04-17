import type { PluginEntry } from "@anthropic/openclaw-plugin-sdk";

const API_BASE = "https://pdfapihub.com/api";

async function callApi(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CLIENT-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
    }
    throw new Error(
      `PDFAPIHub API error (${res.status}): ${(parsed as any).error || text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return { success: true, message: "Binary file returned", content_type: contentType };
}

function getApiKey(config: Record<string, unknown>): string {
  const key =
    (config.apiKey as string) ||
    process.env.PDFAPIHUB_API_KEY ||
    process.env.CLIENT_API_KEY ||
    "";
  if (!key) {
    throw new Error(
      "PDFAPIHub API key not configured. Set it in plugin config, or as PDFAPIHUB_API_KEY environment variable. Get a free key at https://pdfapihub.com"
    );
  }
  return key;
}

function buildBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  return body;
}

const plugin: PluginEntry = {
  id: "html-image",
  name: "HTML to Image",
  register(api) {
    // ─── Generate Image ──────────────────────────────────────
    api.registerTool({
      name: "html_to_image",
      description:
        "Generate a PNG image from HTML content or a public URL using headless Chromium. Supports custom width/height, retina quality (deviceScaleFactor 2x/3x), full-page scrollable screenshots, cookie consent auto-click, Google Fonts, dynamic {{placeholder}} substitution, and multiple output formats (URL, base64, raw file).",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "URL of the webpage to screenshot. Provide either url or html_content.",
          },
          html_content: {
            type: "string",
            description:
              "HTML content to render as an image. Provide either url or html_content.",
          },
          css_content: {
            type: "string",
            description: "Optional CSS to inject into the HTML.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "both", "image", "png", "file"],
            description:
              "Output format. 'url' returns a download URL (default), 'base64' returns base64 PNG, 'both' returns both, 'image'/'png'/'file' returns raw PNG.",
          },
          width: {
            type: "number",
            description: "Output image width in pixels. Default: 1280.",
          },
          height: {
            type: "number",
            description: "Output image height in pixels. Default: 720.",
          },
          viewPortWidth: {
            type: "number",
            description: "Viewport width for rendering (URL mode). Default: 1280.",
          },
          viewPortHeight: {
            type: "number",
            description: "Viewport height for rendering (URL mode). Default: 720.",
          },
          deviceScaleFactor: {
            type: "number",
            description:
              "Device pixel ratio (1-3). Use 2 for retina quality. Default: 1.",
          },
          quality: {
            type: "number",
            description: "Image quality (30-100). Default: 80.",
          },
          full_page: {
            type: "boolean",
            description:
              "Capture full scrollable page instead of just the viewport. URL mode only.",
          },
          wait_until: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description: "Page load strategy for URL mode. Default: 'load'.",
          },
          wait_for_timeout: {
            type: "number",
            description: "Extra delay in ms after page load before capturing.",
          },
          cookie_accept_text: {
            type: "string",
            description:
              "Text of the cookie consent button to auto-click before capturing. E.g. 'Accept All Cookies'.",
          },
          font: {
            type: "string",
            description:
              "Google Font name(s), pipe-separated. E.g. 'Inter|Roboto'.",
          },
          dynamic_params: {
            type: "object",
            additionalProperties: { type: "string" },
            description:
              "Key-value pairs for {{placeholder}} substitution in the HTML.",
          },
          output_filename: {
            type: "string",
            description: "Custom filename for the output image.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/generateImage", buildBody(params), apiKey);
      },
    });

    // ─── Compress Image ──────────────────────────────────────
    api.registerTool({
      name: "compress_image",
      description:
        "Compress an image to JPEG with configurable quality (1-100). Returns compression statistics: original size, compressed size, and reduction percentage. Supports URL and base64 input. Max output 3MB.",
      parameters: {
        type: "object",
        properties: {
          image_url: {
            type: "string",
            description: "Public URL to the image to compress.",
          },
          base64_image: {
            type: "string",
            description:
              "Base64-encoded image (data URI format: data:image/...;base64,...).",
          },
          quality: {
            type: "number",
            description: "Compression quality (1-100). Higher = better quality. Default: 85.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64"],
            description: "Output format. Default: 'url'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/compress", buildBody(params), apiKey);
      },
    });

    // ─── Generate Chart ──────────────────────────────────────
    api.registerTool({
      name: "generate_chart",
      description:
        "Generate a chart image using Chart.js. Supports bar, line, pie, doughnut, radar, polarArea, bubble, and scatter chart types with full Chart.js data and options configuration. Returns chart as URL, base64, or raw image.",
      parameters: {
        type: "object",
        properties: {
          chart_type: {
            type: "string",
            enum: [
              "line",
              "bar",
              "pie",
              "doughnut",
              "radar",
              "polarArea",
              "bubble",
              "scatter",
            ],
            description: "Type of chart to generate.",
          },
          data: {
            type: "object",
            description:
              "Chart.js data configuration with labels and datasets arrays.",
          },
          options: {
            type: "object",
            description:
              "Chart.js options configuration (plugins, scales, legend, title, etc.).",
          },
          width: {
            type: "number",
            description: "Chart width in pixels. Default: 800.",
          },
          height: {
            type: "number",
            description: "Chart height in pixels. Default: 600.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "both", "image"],
            description: "Output format. Default: 'url'.",
          },
        },
        required: ["chart_type", "data"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/generateChart", buildBody(params), apiKey);
      },
    });

    // ─── URL to HTML ─────────────────────────────────────────
    api.registerTool({
      name: "url_to_html",
      description:
        "Fetch the fully-rendered HTML of any public URL using headless Chromium. Useful for scraping SPAs or JS-rendered pages. The fetched HTML can then be passed to html_to_image for rendering.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL to fetch. https:// is auto-prepended if no protocol.",
          },
          wait_till: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description: "Page load strategy. Default: 'load'.",
          },
          timeout: {
            type: "number",
            description: "Navigation timeout in milliseconds. Default: 30000.",
          },
          wait_for_selector: {
            type: "string",
            description:
              "CSS selector to wait for before capturing HTML. Useful for SPAs.",
          },
          wait_for_timeout: {
            type: "number",
            description: "Extra delay in ms after page load.",
          },
          viewport_width: {
            type: "number",
            description: "Browser viewport width in pixels. Default: 1920.",
          },
          viewport_height: {
            type: "number",
            description: "Browser viewport height in pixels. Default: 1080.",
          },
          user_agent: {
            type: "string",
            description: "Custom User-Agent header.",
          },
          headers: {
            type: "object",
            additionalProperties: { type: "string" },
            description: "Additional request headers.",
          },
        },
        required: ["url"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/url-to-html", buildBody(params), apiKey);
      },
    });
  },
};

export default plugin;
