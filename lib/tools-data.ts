export interface FaqItem {
  q: string
  a: string
}

export interface ToolMeta {
  id: string
  title: string
  description: string
  tag: "Client-side" | "Hot" | "New" | "Premium" | "Popular" | "Secure"
  category: "developer" | "image" | "text" | "utility"
  popular?: boolean
  iconName: string
  keywords?: string[]
  faqItems?: FaqItem[]
}

export const tools: ToolMeta[] = [
  // Top Featured Tools
  {
    id: "python-compiler",
    title: "Python Compiler",
    description: "Write and run Python code directly in your browser — powered by WebAssembly. Full Python 3.11 with stdlib, Monaco editor, and instant execution.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "Code2",
    keywords: ["python compiler", "run python online", "python editor", "online python IDE", "python in browser", "python playground"],
    faqItems: [
      { q: "How does Python run in the browser?", a: "The compiler uses Pyodide, a Python distribution compiled to WebAssembly. It runs a full Python 3.11 interpreter directly in your browser with no server needed." },
      { q: "Does it support Python packages?", a: "Yes. The standard library is fully available, and many popular packages like numpy and pandas can be loaded on demand via micropip." },
      { q: "Is my code saved anywhere?", a: "No. Your code stays in your browser session only. Nothing is uploaded or stored on any server. When you close the tab, the code is gone unless you copy it." },
    ],
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to any format (JPG, PNG, WebP, BMP, GIF) with compression and resize options.",
    tag: "Premium",
    category: "image",
    popular: true,
    iconName: "Image",
    keywords: ["image converter", "convert jpg to png", "webp converter", "image format converter", "online image converter", "free image converter"],
    faqItems: [
      { q: "What image formats are supported?", a: "You can convert between JPG, PNG, WebP, BMP, and GIF formats. Each format has different strengths — PNG for lossless quality, WebP for small file sizes, and JPG for universal compatibility." },
      { q: "Is my image uploaded to a server?", a: "No. All conversions happen 100% in your browser using the HTML5 Canvas API. Your files never leave your device, ensuring complete privacy." },
      { q: "Can I resize images during conversion?", a: "Yes! You can enable the resize option to set custom width and height in pixels, with an option to maintain the original aspect ratio." },
    ],
  },
  {
    id: "markdown-preview",
    title: "Markdown Preview",
    description: "Write markdown with live preview, split view, and HTML export.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "FileCode",
    keywords: ["markdown editor", "markdown preview", "markdown to html", "live markdown editor", "online markdown editor"],
    faqItems: [
      { q: "Does this support GitHub Flavored Markdown?", a: "Yes, the editor supports GFM including tables, task lists, strikethrough, and fenced code blocks with syntax highlighting." },
      { q: "Can I export my markdown as HTML?", a: "Absolutely. Use the export feature to download your rendered markdown as a clean HTML file ready for publishing." },
    ],
  },
  {
    id: "image-cropper-resizer",
    title: "Image Cropper & Resizer",
    description: "Resize, rotate, and flip images with live preview and preset sizes.",
    tag: "Popular",
    category: "image",
    popular: true,
    iconName: "Crop",
    keywords: ["image cropper", "image resizer", "crop image online", "resize image online", "rotate image", "flip image"],
    faqItems: [
      { q: "What preset sizes are available?", a: "Common presets include social media sizes (Instagram, Facebook, Twitter), standard photo sizes, and common web dimensions like 1920×1080 and 1280×720." },
      { q: "Can I crop to a specific aspect ratio?", a: "Yes. You can lock the crop area to common aspect ratios like 16:9, 4:3, 1:1, or enter a custom ratio." },
    ],
  },
  {
    id: "doc-to-pdf-converter",
    title: "DOCX to PDF Converter",
    description: "Convert DOCX files to PDF with Word formatting, tables, colors, and images preserved.",
    tag: "Hot",
    category: "utility",
    popular: true,
    iconName: "FileText",
    keywords: ["doc to pdf", "word to pdf", "docx to pdf", "convert word to pdf online", "free doc to pdf converter"],
    faqItems: [
      { q: "Does it preserve formatting and tables?", a: "Yes. The converter maintains your document's formatting including tables, images, headings, lists, and text styles in the resulting PDF." },
      { q: "Is there a file size limit?", a: "Since processing happens in your browser, performance depends on your device. Most documents under 10MB convert smoothly." },
    ],
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create QR codes from text, URLs, or contact info.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "QrCode",
    keywords: ["qr code generator", "create qr code", "free qr code", "qr code maker", "url to qr code"],
    faqItems: [
      { q: "What data can I encode in a QR code?", a: "You can encode plain text, URLs, email addresses, phone numbers, Wi-Fi credentials, and vCard contact information." },
      { q: "Can I download the QR code?", a: "Yes. You can download your generated QR code as a high-resolution PNG image suitable for printing or digital use." },
    ],
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    tag: "Popular",
    category: "developer",
    popular: true,
    iconName: "Code",
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "format json online", "json pretty print"],
    faqItems: [
      { q: "What operations can I perform?", a: "You can format (pretty-print) JSON with indentation, minify it to a single line, or validate it to check for syntax errors — all instantly." },
      { q: "Does it show error locations?", a: "Yes. When validation fails, the tool displays the specific error message from the JSON parser, helping you identify exactly where the syntax issue is." },
      { q: "Is there a size limit for JSON input?", a: "There's no hard limit, but very large JSON files (over 5MB) may be slower to process depending on your browser and device." },
    ],
  },
  {
    id: "pdf-to-doc-converter",
    title: "PDF to DOC Converter",
    description: "Convert PDF files to Word documents (.docx) entirely in your browser.",
    tag: "Hot",
    category: "utility",
    popular: true,
    iconName: "FileText",
    keywords: ["pdf to doc", "pdf to word", "pdf to docx", "convert pdf to word online", "free pdf to doc converter"],
    faqItems: [
      { q: "How accurate is the conversion?", a: "The converter extracts text and basic formatting from PDFs. Text-heavy documents convert very accurately, while complex layouts with many images may need minor adjustments." },
      { q: "Does it work with scanned PDFs?", a: "This tool works best with text-based PDFs. Scanned documents (image-only PDFs) would require OCR capabilities which are not included in this browser-based tool." },
    ],
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL formats.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Palette",
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "color picker", "hex color converter", "css color converter"],
    faqItems: [
      { q: "What color formats are supported?", a: "You can convert between HEX (#RRGGBB), RGB (red, green, blue values 0–255), and HSL (hue, saturation, lightness) formats." },
      { q: "Can I use this for CSS colors?", a: "Yes. All output formats are valid CSS color values that you can copy and paste directly into your stylesheets." },
    ],
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with custom options.",
    tag: "Secure",
    category: "utility",
    popular: true,
    iconName: "Shield",
    keywords: ["password generator", "random password generator", "secure password generator", "strong password generator", "free password generator"],
    faqItems: [
      { q: "How are passwords generated?", a: "Passwords are generated using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers — the same standard used by security applications." },
      { q: "Are generated passwords stored anywhere?", a: "No. Passwords are generated entirely in your browser and never sent to any server. Once you leave the page, the password exists only if you copied it." },
      { q: "What makes a strong password?", a: "A strong password is at least 16 characters long and includes a mix of uppercase, lowercase, numbers, and symbols. The strength indicator shows you how secure your password is." },
    ],
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Hash",
    keywords: ["hash generator", "sha256 generator", "sha512 generator", "sha1 hash", "online hash generator", "checksum generator"],
    faqItems: [
      { q: "What hash algorithms are available?", a: "The tool supports SHA-1, SHA-256, SHA-384, and SHA-512. SHA-256 is the most commonly used for general purposes, while SHA-512 offers the highest security." },
      { q: "What are hashes used for?", a: "Hashes are used to verify file integrity, store passwords securely, create digital signatures, and ensure data hasn't been tampered with." },
    ],
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, volume, and speed units.",
    tag: "Popular",
    category: "utility",
    popular: true,
    iconName: "Calculator",
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "metric converter", "imperial to metric"],
    faqItems: [
      { q: "What unit categories are supported?", a: "You can convert between length (meters, feet, inches), weight (kg, lbs, oz), temperature (°C, °F, K), volume (liters, gallons), and speed (km/h, mph) units." },
      { q: "Are the conversions accurate?", a: "Yes. All conversions use standard mathematical formulas with full floating-point precision, giving you accurate results for both everyday and professional use." },
    ],
  },

  // Developer Tools
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time highlighting.",
    tag: "New",
    category: "developer",
    iconName: "Regex",
    keywords: ["regex tester", "regular expression tester", "regex debugger", "regex validator", "test regex online"],
    faqItems: [
      { q: "Does it support regex flags?", a: "Yes. You can toggle common flags like global (g), case-insensitive (i), and multiline (m) to test different matching behaviors." },
      { q: "Does it show matches in real time?", a: "Yes. As you type your regex pattern and test string, matches are highlighted instantly so you can see exactly what your pattern captures." },
    ],
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens — view header, payload, and expiry.",
    tag: "Popular",
    category: "developer",
    iconName: "KeyRound",
    keywords: ["jwt decoder", "jwt debugger", "decode jwt", "json web token decoder", "jwt parser"],
    faqItems: [
      { q: "Can I decode expired tokens?", a: "Yes. The decoder will decode any valid JWT regardless of its expiration status, and clearly show you the expiration timestamp so you can check if it's still valid." },
      { q: "Is it safe to paste my JWT here?", a: "Absolutely. The decoding happens entirely in your browser — no data is sent to any server. Your tokens remain private." },
    ],
  },
  {
    id: "json-to-typescript",
    title: "JSON → TypeScript",
    description: "Generate TypeScript interfaces from JSON with nested types and arrays.",
    tag: "Popular",
    category: "developer",
    iconName: "Braces",
    keywords: ["json to typescript", "json to ts", "generate typescript interface", "json to type", "typescript interface generator"],
    faqItems: [
      { q: "Does it handle nested objects?", a: "Yes. The generator recursively processes nested objects and creates separate named interfaces for each level, producing clean, well-organized TypeScript code." },
      { q: "How does it handle arrays?", a: "Arrays are typed based on their contents. If an array contains objects, a separate interface is generated for the array item type." },
    ],
  },
  {
    id: "yaml-json-converter",
    title: "YAML ↔ JSON Converter",
    description: "Convert between YAML and JSON formats bidirectionally.",
    tag: "New",
    category: "developer",
    iconName: "FileJson",
    keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml json converter", "convert yaml online"],
    faqItems: [
      { q: "Can I convert in both directions?", a: "Yes. You can paste YAML and convert to JSON, or paste JSON and convert to YAML — the tool works bidirectionally with a single click." },
      { q: "Does it preserve comments?", a: "YAML comments are not preserved when converting to JSON, as JSON does not support comments. However, all data values and structure are accurately converted." },
    ],
  },
  {
    id: "cron-parser",
    title: "Cron Expression Parser",
    description: "Parse cron expressions into human-readable schedules with next run times.",
    tag: "New",
    category: "developer",
    iconName: "Timer",
    keywords: ["cron parser", "cron expression parser", "cron job parser", "cron schedule", "cron expression generator"],
    faqItems: [
      { q: "What cron format is supported?", a: "The parser supports standard 5-field cron expressions (minute, hour, day-of-month, month, day-of-week) used by most Unix/Linux systems and cloud platforms." },
      { q: "Does it show when the cron job runs next?", a: "Yes. The tool calculates and displays the next several scheduled run times based on your cron expression, so you can verify your schedule is correct." },
    ],
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format, minify, and beautify SQL queries with keyword uppercasing.",
    tag: "New",
    category: "developer",
    iconName: "Database",
    keywords: ["sql formatter", "sql beautifier", "format sql online", "sql pretty print", "sql minifier"],
    faqItems: [
      { q: "What SQL dialects are supported?", a: "The formatter handles standard SQL syntax that works across MySQL, PostgreSQL, SQLite, and SQL Server. It automatically uppercases SQL keywords for readability." },
      { q: "Can I minify SQL?", a: "Yes. Besides beautifying, you can also minify SQL queries into a single line, which is useful for embedding in code or reducing payload size." },
    ],
  },
  {
    id: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description: "Encode and decode HTML entities with a built-in reference table.",
    tag: "Client-side",
    category: "developer",
    iconName: "Code2",
    keywords: ["html entity encoder", "html entity decoder", "html entities", "encode html", "decode html entities"],
    faqItems: [
      { q: "What are HTML entities?", a: "HTML entities are special codes that represent reserved characters in HTML (like <, >, &) or special symbols (like ©, €, →). Encoding them prevents rendering issues and XSS vulnerabilities." },
      { q: "Does it include a reference table?", a: "Yes. The tool includes a comprehensive reference table of common HTML entities so you can quickly look up the code for any character you need." },
    ],
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description: "Generate SEO meta tags, Open Graph, and Twitter Card markup with preview.",
    tag: "Popular",
    category: "developer",
    iconName: "Globe",
    keywords: ["meta tag generator", "seo meta tags", "open graph generator", "twitter card generator", "meta description generator"],
    faqItems: [
      { q: "What meta tags does it generate?", a: "It generates standard SEO meta tags (title, description, keywords), Open Graph tags for Facebook/LinkedIn sharing, Twitter Card tags, and canonical URL tags." },
      { q: "Can I preview how my page will look in search results?", a: "Yes. The tool includes a live preview showing how your page will appear in Google search results and when shared on social media platforms." },
    ],
  },
  {
    id: "chmod-calculator",
    title: "Chmod Calculator",
    description: "Calculate Unix file permissions in numeric and symbolic notation.",
    tag: "New",
    category: "developer",
    iconName: "Terminal",
    keywords: ["chmod calculator", "file permissions calculator", "unix permissions", "linux chmod", "permission calculator"],
    faqItems: [
      { q: "What's the difference between numeric and symbolic notation?", a: "Numeric notation uses three digits (e.g., 755), where each digit represents permissions for owner, group, and others. Symbolic notation uses letters like rwxr-xr-x to represent the same permissions." },
      { q: "What does chmod 755 mean?", a: "chmod 755 gives the owner full permissions (read, write, execute) and gives the group and others read and execute permissions only. It's the most common permission for web server files." },
    ],
  },

  // Text Tools
  {
    id: "text-minifier",
    title: "Text Minifier",
    description: "Compress HTML, CSS, and JavaScript code instantly.",
    tag: "Popular",
    category: "text",
    iconName: "Zap",
    keywords: ["text minifier", "html minifier", "css minifier", "javascript minifier", "code minifier", "compress code"],
    faqItems: [
      { q: "What languages can I minify?", a: "You can minify HTML, CSS, and JavaScript code. The minifier removes whitespace, comments, and unnecessary characters to reduce file size." },
      { q: "How much smaller will my code be?", a: "Reduction varies by code style, but typically you can expect 20-60% size reduction. Code with lots of comments and formatting will see the biggest savings." },
    ],
  },
  {
    id: "base64-converter",
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    tag: "Client-side",
    category: "text",
    iconName: "Shield",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "encode base64", "decode base64", "base64 to text"],
    faqItems: [
      { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. It's commonly used for embedding images in CSS/HTML, encoding email attachments, and transmitting binary data in text-based protocols." },
      { q: "Can I encode files?", a: "Yes. You can encode both text strings and files (like images) to Base64, and decode Base64 strings back to their original form." },
    ],
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and URI components.",
    tag: "New",
    category: "text",
    iconName: "Link",
    keywords: ["url encoder", "url decoder", "encode url", "decode url", "uri encoder", "percent encoding"],
    faqItems: [
      { q: "When do I need URL encoding?", a: "URL encoding is needed when your URL contains special characters like spaces, &, =, or non-ASCII characters. Encoding ensures the URL is transmitted correctly across the internet." },
      { q: "What's the difference between URL and URI encoding?", a: "URL encoding (encodeURI) encodes a full URL preserving special URL characters. URI component encoding (encodeURIComponent) encodes everything, suitable for query parameter values." },
    ],
  },
  {
    id: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences line by line.",
    tag: "New",
    category: "text",
    iconName: "AlignLeft",
    keywords: ["text diff checker", "compare text", "text comparison tool", "diff checker online", "find differences in text"],
    faqItems: [
      { q: "How are differences shown?", a: "Differences are highlighted line by line with color coding — added lines in green, removed lines in red, and unchanged lines in their normal color." },
      { q: "Can I compare large texts?", a: "Yes. The diff checker handles large texts efficiently. For very large documents, processing may take a moment but works reliably in modern browsers." },
    ],
  },
  {
    id: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts.",
    tag: "Client-side",
    category: "text",
    iconName: "TextIcon",
    keywords: ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "lipsum generator", "generate lorem ipsum"],
    faqItems: [
      { q: "What output options are available?", a: "You can generate paragraphs, sentences, or words of Lorem Ipsum text. Customize the quantity to get exactly the amount of placeholder text you need." },
      { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is standard placeholder text used in the printing and design industry since the 1500s. It helps designers visualize how real text will look in a layout without the distraction of meaningful content." },
    ],
  },

  // Utility Tools
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates with timezone support.",
    tag: "Popular",
    category: "utility",
    iconName: "Clock",
    keywords: ["timestamp converter", "unix timestamp converter", "epoch converter", "date to timestamp", "timestamp to date"],
    faqItems: [
      { q: "What is a Unix timestamp?", a: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (UTC). It's widely used in programming and databases to represent dates and times." },
      { q: "Does it support different timezones?", a: "Yes. You can convert timestamps to and from different timezones, including UTC and your local timezone." },
    ],
  },
  {
    id: "uuid-generator",
    title: "UUID / ID Generator",
    description: "Generate cryptographically secure UUIDs, NanoIDs, and ULID-like identifiers.",
    tag: "Secure",
    category: "utility",
    iconName: "Fingerprint",
    keywords: ["uuid generator", "nanoid generator", "unique id generator", "guid generator", "random id generator"],
    faqItems: [
      { q: "What types of IDs can I generate?", a: "You can generate UUID v4 (standard 36-character universally unique identifiers), NanoID (shorter, URL-friendly IDs), and ULID-like identifiers (sortable, timestamp-based IDs)." },
      { q: "Are the generated IDs truly unique?", a: "Yes. All IDs are generated using the Web Crypto API which provides cryptographically secure random values. The probability of collision is astronomically low." },
    ],
  },
  {
    id: "css-gradient-generator",
    title: "CSS Gradient Generator",
    description: "Create linear, radial, and conic CSS gradients with live preview.",
    tag: "New",
    category: "utility",
    iconName: "Paintbrush",
    keywords: ["css gradient generator", "gradient maker", "linear gradient", "radial gradient", "css gradient tool"],
    faqItems: [
      { q: "What gradient types are supported?", a: "You can create linear, radial, and conic CSS gradients. Each type offers different controls for direction, shape, and color stop positions." },
      { q: "Can I copy the CSS code?", a: "Yes. The generated CSS gradient code is ready to copy and paste directly into your stylesheet. It includes vendor prefixes for maximum browser compatibility." },
    ],
  },
  {
    id: "css-box-shadow-generator",
    title: "CSS Box Shadow Generator",
    description: "Create multi-layer box shadows with live preview and presets.",
    tag: "New",
    category: "utility",
    iconName: "Square",
    keywords: ["css box shadow generator", "box shadow maker", "css shadow tool", "shadow generator online", "box shadow css"],
    faqItems: [
      { q: "Can I add multiple shadow layers?", a: "Yes. You can stack multiple shadow layers to create complex, realistic shadow effects. Each layer has independent settings for offset, blur, spread, and color." },
      { q: "Are there pre-made shadow presets?", a: "Yes. Several professionally designed presets are available as starting points, including subtle, medium, large, and inner shadow styles." },
    ],
  },
  {
    id: "aspect-ratio-calculator",
    title: "Aspect Ratio Calculator",
    description: "Calculate dimensions and ratios for video, photos, and responsive design.",
    tag: "New",
    category: "utility",
    iconName: "Ratio",
    keywords: ["aspect ratio calculator", "image ratio calculator", "video aspect ratio", "screen resolution calculator", "dimension calculator"],
    faqItems: [
      { q: "What can I calculate with this tool?", a: "Enter any two dimensions (width and height) to calculate the aspect ratio. You can also lock a ratio and calculate the missing dimension based on one known value." },
      { q: "What are common aspect ratios?", a: "Common ratios include 16:9 (widescreen video), 4:3 (traditional TV), 1:1 (square/Instagram), 9:16 (vertical/mobile video), and 21:9 (ultrawide)." },
    ],
  },
  {
    id: "color-palette-generator",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes and export as CSS or Tailwind config.",
    tag: "Popular",
    category: "utility",
    iconName: "Droplets",
    keywords: ["color palette generator", "color scheme generator", "tailwind colors", "css color palette", "color harmony generator"],
    faqItems: [
      { q: "What color harmonies are supported?", a: "The generator supports complementary, analogous, triadic, split-complementary, and monochromatic color harmonies based on color theory principles." },
      { q: "Can I export for Tailwind CSS?", a: "Yes. You can export your generated palette as CSS custom properties or as a Tailwind CSS configuration object ready to paste into your tailwind.config.js." },
    ],
  },
  {
    id: "svg-to-png",
    title: "SVG to PNG Converter",
    description: "Convert SVG files to high-quality PNG images with custom dimensions.",
    tag: "New",
    category: "image",
    iconName: "Image",
    keywords: ["svg to png", "convert svg to png", "svg converter", "svg to image", "svg to png online"],
    faqItems: [
      { q: "Can I set custom dimensions for the PNG?", a: "Yes. You can specify the exact width and height in pixels for the output PNG, allowing you to create high-resolution exports from scalable SVG files." },
      { q: "Does it preserve transparency?", a: "Yes. PNG supports transparency, so any transparent areas in your SVG will remain transparent in the converted PNG output." },
    ],
  },
  {
    id: "seo-performance-auditor",
    title: "SEO & Performance Auditor",
    description: "Audit any website's SEO, performance, and accessibility with Google Lighthouse scores, Core Web Vitals, and detailed on-page HTML analysis.",
    tag: "Hot",
    category: "developer",
    popular: true,
    iconName: "Globe",
    keywords: ["seo auditor", "website performance checker", "lighthouse scores", "core web vitals", "seo checker", "page speed test", "website seo analysis"],
    faqItems: [
      { q: "What does the SEO Auditor check?", a: "It analyzes Google Lighthouse scores (Performance, SEO, Accessibility, Best Practices), Core Web Vitals (FCP, LCP, TBT, CLS), security headers, Open Graph tags, structured data, heading structure, meta tags, and more." },
      { q: "Does it use Google's API?", a: "Yes. The tool uses the Google PageSpeed Insights API to fetch real Lighthouse audit data, giving you the same scores you'd see in Chrome DevTools." },
      { q: "Can I audit any website?", a: "You can audit any publicly accessible website. Simply enter the URL and the tool will fetch and analyze the page's SEO health, performance metrics, and accessibility scores." },
    ],
  },
]

export function getToolById(id: string): ToolMeta | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolsByCategory(category: string): ToolMeta[] {
  if (category === "all") return tools
  return tools.filter((t) => t.category === category)
}

export const siteConfig = {
  url: "https://tools.zamdev.me",
  name: "Tools by ZamDev",
  description:
    "30+ free browser tools for developers & designers. Convert images, format JSON, generate passwords & more — 100% client-side, no uploads.",
}
