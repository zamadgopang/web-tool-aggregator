export interface FaqItem {
  q: string
  a: string
}

export interface SeoContent {
  longDescription: string
  howItWorks: string[]
  useCases: string[]
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
  seoContent?: SeoContent
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
    keywords: ["python compiler", "run python online", "python editor", "online python IDE", "python in browser", "python playground", "python code runner", "python REPL online", "learn python online", "python sandbox", "browser python", "python webassembly"],
    seoContent: {
      longDescription: "The ZamDev Online Python Compiler is a full-featured Python 3.11 development environment that runs entirely in your web browser. Powered by Pyodide and WebAssembly, it executes real Python code without any server — everything happens on your device. Whether you are learning Python, prototyping algorithms, or testing quick scripts, this tool provides a Monaco-based code editor with syntax highlighting, auto-completion, and instant output. No installation, no account, and no setup required.",
      howItWorks: [
        "Open the Python Compiler and start writing code in the Monaco editor.",
        "Click Run or press Ctrl+Enter to execute your script instantly.",
        "View output, errors, and print statements in the built-in terminal panel.",
        "Use the file tabs to manage multiple scripts in the same session.",
        "Import standard library modules and popular packages like numpy via micropip."
      ],
      useCases: [
        "Learning Python fundamentals with instant feedback",
        "Prototyping algorithms and data structures quickly",
        "Testing code snippets before adding them to a project",
        "Running Python on shared or restricted computers without installing anything",
        "Teaching Python in classrooms or workshops without environment setup",
        "Quickly debugging small scripts or regular expressions"
      ],
    },
    faqItems: [
      { q: "How does Python run in the browser?", a: "The compiler uses Pyodide, a Python distribution compiled to WebAssembly. It runs a full Python 3.11 interpreter directly in your browser with no server needed." },
      { q: "Does it support Python packages?", a: "Yes. The standard library is fully available, and many popular packages like numpy and pandas can be loaded on demand via micropip." },
      { q: "Is my code saved anywhere?", a: "No. Your code stays in your browser session only. Nothing is uploaded or stored on any server. When you close the tab, the code is gone unless you copy it." },
      { q: "Can I use this for learning Python?", a: "Absolutely. The instant feedback loop, syntax highlighting, and error messages make it ideal for beginners. You can experiment freely without worrying about breaking anything on your computer." },
      { q: "What keyboard shortcuts are available?", a: "Press Ctrl+Enter (or Cmd+Enter on Mac) to run code, Ctrl+S to trigger save actions, and use standard Monaco editor shortcuts for find/replace, multi-cursor editing, and code folding." },
      { q: "Does it support input() for user input?", a: "Yes. When your code calls input(), an input terminal appears where you can type values. The execution pauses until you provide the input, just like a real terminal." },
      { q: "How fast is the execution compared to desktop Python?", a: "WebAssembly execution is surprisingly fast — typically within 2-5x of native CPython speed. For most scripts, the difference is imperceptible." },
      { q: "Can I use this on mobile devices?", a: "Yes. The compiler works on mobile browsers including Chrome and Safari on iOS/Android. The Monaco editor adapts to smaller screens, though a keyboard is recommended for coding." },
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
    keywords: ["image converter", "convert jpg to png", "webp converter", "image format converter", "online image converter", "free image converter", "png to jpg", "jpg to webp", "image compression", "bulk image converter", "photo format converter", "resize image online"],
    seoContent: {
      longDescription: "The ZamDev Image Converter lets you convert images between all major formats — JPG, PNG, WebP, BMP, and GIF — instantly in your browser. It supports compression quality control and optional resizing, making it perfect for optimizing images for the web, social media, or email attachments. Unlike cloud-based converters, your images are never uploaded to any server, ensuring maximum privacy and speed. The tool uses the HTML5 Canvas API for high-quality format conversion with full control over output settings.",
      howItWorks: [
        "Drag and drop an image or click to browse and select a file from your device.",
        "Choose the target output format (JPG, PNG, WebP, BMP, or GIF).",
        "Optionally adjust quality/compression and enable resizing with custom dimensions.",
        "Click Convert and download the converted image instantly.",
        "Repeat with additional images — there are no limits on conversions."
      ],
      useCases: [
        "Converting PNG screenshots to smaller JPG files for email",
        "Optimizing images to WebP format for faster website loading",
        "Preparing social media images in the correct format and dimensions",
        "Converting BMP files from legacy software to modern formats",
        "Resizing product photos for e-commerce listings",
        "Reducing image file sizes for faster upload to CMS platforms"
      ],
    },
    faqItems: [
      { q: "What image formats are supported?", a: "You can convert between JPG, PNG, WebP, BMP, and GIF formats. Each format has different strengths — PNG for lossless quality, WebP for small file sizes, and JPG for universal compatibility." },
      { q: "Is my image uploaded to a server?", a: "No. All conversions happen 100% in your browser using the HTML5 Canvas API. Your files never leave your device, ensuring complete privacy." },
      { q: "Can I resize images during conversion?", a: "Yes! You can enable the resize option to set custom width and height in pixels, with an option to maintain the original aspect ratio." },
      { q: "What is the best format for web images?", a: "WebP offers the best balance of quality and file size for web use — typically 25-35% smaller than JPG at the same visual quality. If you need transparency, use PNG or WebP." },
      { q: "Is there a file size limit?", a: "There is no hard limit since processing happens locally. Very large images (50MB+) may take a moment depending on your device, but most images convert in under a second." },
      { q: "Can I convert multiple images at once?", a: "You can convert images one at a time. Process each image and download it before converting the next one. Each conversion is instant so batch processing is quick." },
      { q: "Does converting reduce image quality?", a: "Converting to lossy formats like JPG will compress the image. You can control the quality slider — higher values preserve more detail. Converting between lossless formats (PNG to PNG) preserves full quality." },
      { q: "Why should I use WebP instead of JPG?", a: "WebP files are typically 25-35% smaller than equivalent JPGs while maintaining the same visual quality. WebP also supports transparency (like PNG) and animation (like GIF), making it a versatile modern format supported by all major browsers." },
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
    keywords: ["markdown editor", "markdown preview", "markdown to html", "live markdown editor", "online markdown editor", "markdown renderer", "github markdown", "markdown viewer", "write markdown online", "markdown syntax"],
    seoContent: {
      longDescription: "The ZamDev Markdown Preview is a real-time markdown editor and renderer built for developers, writers, and content creators. It supports GitHub Flavored Markdown including tables, task lists, code blocks with syntax highlighting, and more. Write in the editor pane and instantly see the rendered output in the side-by-side preview. When you are done, export your work as a clean HTML file ready for publishing on any platform.",
      howItWorks: [
        "Type or paste your Markdown content in the editor pane on the left.",
        "See the rendered preview update in real time on the right.",
        "Use the split view toggle to switch between editor-only, preview-only, or side-by-side modes.",
        "Click Export to download your rendered Markdown as an HTML file.",
        "Copy the raw HTML output for use in blog posts, documentation, or emails."
      ],
      useCases: [
        "Writing README files for GitHub repositories",
        "Drafting blog posts and articles in Markdown format",
        "Creating documentation with headers, code blocks, and tables",
        "Previewing Markdown before committing to version control",
        "Converting Markdown notes to HTML for email newsletters",
        "Teaching Markdown syntax to new developers"
      ],
    },
    faqItems: [
      { q: "Does this support GitHub Flavored Markdown?", a: "Yes, the editor supports GFM including tables, task lists, strikethrough, and fenced code blocks with syntax highlighting." },
      { q: "Can I export my markdown as HTML?", a: "Absolutely. Use the export feature to download your rendered markdown as a clean HTML file ready for publishing." },
      { q: "Does the preview update in real time?", a: "Yes. As you type in the editor, the rendered preview updates instantly — there is no delay or manual refresh needed." },
      { q: "Can I use code blocks with syntax highlighting?", a: "Yes. Wrap your code in triple backticks with a language identifier (e.g., ```javascript) and the preview will render it with proper syntax highlighting." },
      { q: "Does it support images and links?", a: "Yes. Standard Markdown image syntax ![alt](url) and link syntax [text](url) are fully supported and rendered in the preview." },
      { q: "Can I use this to write documentation?", a: "Absolutely. The editor handles headings, lists, tables, code blocks, blockquotes, and all standard Markdown elements used in technical documentation." },
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
    keywords: ["image cropper", "image resizer", "crop image online", "resize image online", "rotate image", "flip image", "photo resizer", "image dimensions", "crop photo free", "resize photo for social media", "image editor online"],
    seoContent: {
      longDescription: "The ZamDev Image Cropper & Resizer gives you precise control over image dimensions, rotation, and orientation — all in your browser. Crop images to exact pixel dimensions or popular aspect ratios, resize for social media platforms, rotate and flip with a single click, and preview every change before downloading. No software installation needed and your images never leave your device.",
      howItWorks: [
        "Upload an image by dragging it into the tool or clicking to browse.",
        "Select a preset size (Instagram, Facebook, Twitter) or enter custom dimensions.",
        "Use the crop handle to select your desired area, or rotate/flip the image.",
        "Preview the result in real time as you adjust settings.",
        "Download the processed image in your chosen format."
      ],
      useCases: [
        "Cropping profile pictures to exact square dimensions",
        "Resizing images for Instagram, Facebook, and Twitter posts",
        "Preparing product images with consistent dimensions for e-commerce",
        "Rotating photos taken in the wrong orientation",
        "Creating banner images with specific pixel requirements",
        "Resizing screenshots for documentation or presentations"
      ],
    },
    faqItems: [
      { q: "What preset sizes are available?", a: "Common presets include social media sizes (Instagram, Facebook, Twitter), standard photo sizes, and common web dimensions like 1920×1080 and 1280×720." },
      { q: "Can I crop to a specific aspect ratio?", a: "Yes. You can lock the crop area to common aspect ratios like 16:9, 4:3, 1:1, or enter a custom ratio." },
      { q: "Does it support batch processing?", a: "The tool processes one image at a time for precise control. Each operation is instant, making iterative editing very fast." },
      { q: "Can I rotate images by a specific degree?", a: "Yes. You can rotate images by 90° increments (clockwise or counter-clockwise) and also flip horizontally or vertically." },
      { q: "What image formats can I crop?", a: "The tool supports all common image formats including JPG, PNG, WebP, BMP, and GIF. The output maintains the original format quality." },
      { q: "Will cropping reduce my image quality?", a: "No. Cropping simply selects a region of the original image without re-compression. The cropped area retains the original pixel-level quality." },
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
    keywords: ["doc to pdf", "word to pdf", "docx to pdf", "convert word to pdf online", "free doc to pdf converter", "word document to pdf", "docx converter", "office to pdf", "document converter online", "word to pdf no upload"],
    seoContent: {
      longDescription: "The ZamDev DOCX to PDF Converter transforms Microsoft Word documents into professional PDF files directly in your browser. It preserves your document's formatting, tables, images, headings, lists, and text styles — producing a PDF that looks exactly like the original. Unlike online converters that upload your files to remote servers, this tool processes everything locally on your device, keeping sensitive documents completely private.",
      howItWorks: [
        "Click the upload area or drag and drop your .docx file.",
        "The tool parses the Word document and renders it with preserved formatting.",
        "Preview the converted PDF output before downloading.",
        "Click Download to save the PDF to your device.",
        "Your original file is never sent to any server — everything happens in your browser."
      ],
      useCases: [
        "Converting resumes and cover letters to PDF for job applications",
        "Sharing reports and proposals in a universal PDF format",
        "Creating printable versions of Word documents",
        "Converting contracts and agreements to non-editable PDF",
        "Preparing documents for email attachments in a compact format",
        "Archiving Word documents as PDFs for long-term storage"
      ],
    },
    faqItems: [
      { q: "Does it preserve formatting and tables?", a: "Yes. The converter maintains your document's formatting including tables, images, headings, lists, and text styles in the resulting PDF." },
      { q: "Is there a file size limit?", a: "Since processing happens in your browser, performance depends on your device. Most documents under 10MB convert smoothly." },
      { q: "Are my documents sent to a server?", a: "No. The entire conversion process happens in your browser using JavaScript. Your document is never uploaded — it stays on your device from start to finish." },
      { q: "Does it handle images embedded in the Word file?", a: "Yes. Embedded images, logos, and graphics in your DOCX file are preserved in the PDF output with their original positioning and quality." },
      { q: "Can I convert multiple documents?", a: "You can convert documents one at a time. Each conversion takes just a few seconds, so processing multiple files is quick and easy." },
      { q: "What Word features are supported?", a: "The converter supports headings, paragraphs, bold/italic/underline text, numbered and bulleted lists, tables, images, page breaks, and most common Word formatting elements." },
      { q: "Does it support .doc files (older format)?", a: "This tool is optimized for .docx files (the modern Word format). Older .doc files should be saved as .docx in Word first for best results." },
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
    keywords: ["qr code generator", "create qr code", "free qr code", "qr code maker", "url to qr code", "qr code creator online", "custom qr code", "qr code for website", "qr code download png", "vcard qr code"],
    seoContent: {
      longDescription: "The ZamDev QR Code Generator creates high-quality QR codes from any text, URL, email, phone number, or contact information in seconds. Generate scannable codes that work with every smartphone camera and QR code reader app. Download your QR codes as high-resolution PNG images perfect for printing on business cards, flyers, product packaging, or digital use. All generation happens client-side — no data is sent to any server.",
      howItWorks: [
        "Enter the text, URL, or contact information you want to encode.",
        "The QR code generates instantly as you type.",
        "Customize the size and error correction level if needed.",
        "Preview the QR code and test it with your phone camera.",
        "Download the QR code as a high-resolution PNG image."
      ],
      useCases: [
        "Adding QR codes to business cards linking to your portfolio",
        "Creating scannable codes for restaurant menus or event tickets",
        "Generating WiFi QR codes so guests can join your network easily",
        "Linking product packaging to instruction manuals or warranty pages",
        "Sharing contact information (vCard) via scannable codes",
        "Adding QR codes to marketing materials linking to landing pages"
      ],
    },
    faqItems: [
      { q: "What data can I encode in a QR code?", a: "You can encode plain text, URLs, email addresses, phone numbers, Wi-Fi credentials, and vCard contact information." },
      { q: "Can I download the QR code?", a: "Yes. You can download your generated QR code as a high-resolution PNG image suitable for printing or digital use." },
      { q: "What size should my QR code be for printing?", a: "For business cards, a 1×1 inch (2.5 cm) QR code works well. For posters and banners, use at least 2×2 inches. The higher the resolution you download, the better the print quality." },
      { q: "Do QR codes expire?", a: "No. Static QR codes never expire. The data is encoded directly in the pattern, so the QR code will work as long as the linked content (like a URL) remains accessible." },
      { q: "What is error correction in QR codes?", a: "Error correction allows a QR code to remain scannable even if parts are damaged or obscured. Higher error correction levels (like H) allow up to 30% of the code to be damaged while still being readable." },
      { q: "How many characters can a QR code hold?", a: "A QR code can hold up to 4,296 alphanumeric characters or 7,089 numeric characters. For best scannability, keep your content under 300 characters." },
      { q: "Will the QR code work on all smartphones?", a: "Yes. All modern smartphones with cameras can scan QR codes natively — no special app is required. This works on both iOS and Android devices." },
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
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "format json online", "json pretty print", "json lint", "json parser", "validate json online", "json viewer", "json indent"],
    seoContent: {
      longDescription: "The ZamDev JSON Formatter is a powerful tool for formatting, validating, and minifying JSON data instantly in your browser. Paste messy, unformatted JSON and transform it into clean, indented, syntax-highlighted output in one click. The built-in validator catches syntax errors and pinpoints the exact location, making debugging JSON payloads fast and easy. Whether you are working with API responses, configuration files, or database exports, this tool handles JSON of any complexity.",
      howItWorks: [
        "Paste your JSON data into the editor panel.",
        "Click Format to pretty-print with proper indentation and syntax highlighting.",
        "Use Minify to compress JSON into a single line for production use.",
        "The validator instantly flags any syntax errors with descriptive messages.",
        "Copy the formatted or minified output to your clipboard with one click."
      ],
      useCases: [
        "Formatting API response JSON for readability and debugging",
        "Validating JSON configuration files before deployment",
        "Minifying JSON payloads to reduce bandwidth in web applications",
        "Debugging malformed JSON from databases or third-party APIs",
        "Preparing clean JSON for documentation or code reviews",
        "Inspecting webhook payloads during integration development"
      ],
    },
    faqItems: [
      { q: "What operations can I perform?", a: "You can format (pretty-print) JSON with indentation, minify it to a single line, or validate it to check for syntax errors — all instantly." },
      { q: "Does it show error locations?", a: "Yes. When validation fails, the tool displays the specific error message from the JSON parser, helping you identify exactly where the syntax issue is." },
      { q: "Is there a size limit for JSON input?", a: "There's no hard limit, but very large JSON files (over 5MB) may be slower to process depending on your browser and device." },
      { q: "Does it support JSON with comments?", a: "Standard JSON does not allow comments. If your JSON contains comments (like JSONC), you will need to remove them before formatting. The validator will flag comments as syntax errors." },
      { q: "Can I customize the indentation?", a: "The formatter uses 2-space indentation by default, which is the most common standard for JSON. The output is clean and consistent for all JSON structures." },
      { q: "Does it handle nested JSON well?", a: "Yes. The formatter correctly handles deeply nested objects and arrays of any depth, with proper indentation at every level for maximum readability." },
      { q: "Can I use this to compare two JSON objects?", a: "For JSON comparison, use our Text Diff Checker tool. The JSON Formatter is focused on formatting, validation, and minification of single JSON documents." },
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
    keywords: ["pdf to doc", "pdf to word", "pdf to docx", "convert pdf to word online", "free pdf to doc converter", "pdf to word converter", "pdf converter online", "extract text from pdf", "pdf to editable word", "pdf to document"],
    seoContent: {
      longDescription: "The ZamDev PDF to DOC Converter extracts text and formatting from PDF files and generates editable Word documents (.docx) entirely in your browser. Perfect for editing contracts, updating resumes stored as PDFs, or extracting content from reports. Unlike online converters that require file uploads, your documents stay on your device throughout the entire conversion process.",
      howItWorks: [
        "Upload a PDF file by clicking or dragging it into the converter.",
        "The tool parses the PDF and extracts text content and formatting.",
        "Review the extracted content in the preview panel.",
        "Click Download to save the converted Word document (.docx).",
        "Open the .docx file in Microsoft Word, Google Docs, or any compatible editor."
      ],
      useCases: [
        "Editing contracts and agreements originally provided as PDF",
        "Updating resumes and CVs stored in PDF format",
        "Extracting text from PDF reports for further analysis",
        "Converting PDF manuals into editable documentation",
        "Repurposing PDF content for presentations or emails",
        "Making PDF forms editable in Word for easier completion"
      ],
    },
    faqItems: [
      { q: "How accurate is the conversion?", a: "The converter extracts text and basic formatting from PDFs. Text-heavy documents convert very accurately, while complex layouts with many images may need minor adjustments." },
      { q: "Does it work with scanned PDFs?", a: "This tool works best with text-based PDFs. Scanned documents (image-only PDFs) would require OCR capabilities which are not included in this browser-based tool." },
      { q: "Is my PDF uploaded to a server?", a: "No. The entire conversion process runs in your browser using JavaScript. Your PDF file never leaves your device, ensuring complete document privacy." },
      { q: "Can I convert password-protected PDFs?", a: "Password-protected PDFs need to be unlocked first. If you know the password, open the PDF in a reader and remove the protection before converting." },
      { q: "What formatting is preserved?", a: "Text content, paragraphs, headings, basic font styles (bold, italic), and lists are preserved. Complex layouts, custom fonts, and embedded forms may require manual adjustment after conversion." },
      { q: "Can I edit the Word file in Google Docs?", a: "Yes. The generated .docx file is compatible with Microsoft Word, Google Docs, LibreOffice Writer, and any other word processor that supports the .docx format." },
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
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "color picker", "hex color converter", "css color converter", "hsl to hex", "rgb to hex", "color code converter", "web color converter", "color format tool"],
    seoContent: {
      longDescription: "The ZamDev Color Converter instantly translates colors between HEX, RGB, and HSL formats — the three most common color systems used in web development and design. Enter a color in any format and get all equivalent values with live preview. Every output is valid CSS, so you can copy and paste directly into your code. Perfect for designers matching brand colors and developers working with CSS.",
      howItWorks: [
        "Enter a color value in HEX (e.g., #3B82F6), RGB (e.g., 59, 130, 246), or HSL format.",
        "The tool instantly converts and displays the color in all three formats.",
        "See a live color preview swatch to verify the result visually.",
        "Click copy on any format to add it to your clipboard.",
        "Use the output directly in CSS, Tailwind, or any design tool."
      ],
      useCases: [
        "Converting brand color HEX codes to RGB for design software",
        "Translating design system colors between CSS formats",
        "Finding HSL values for creating color variations (lighter/darker shades)",
        "Converting colors from Figma/Sketch exports to CSS-ready values",
        "Matching print CMYK-converted colors to web HEX equivalents",
        "Debugging CSS color issues by comparing format representations"
      ],
    },
    faqItems: [
      { q: "What color formats are supported?", a: "You can convert between HEX (#RRGGBB), RGB (red, green, blue values 0–255), and HSL (hue, saturation, lightness) formats." },
      { q: "Can I use this for CSS colors?", a: "Yes. All output formats are valid CSS color values that you can copy and paste directly into your stylesheets." },
      { q: "What is the difference between HEX and RGB?", a: "HEX and RGB represent the same color space. HEX uses a compact hexadecimal notation (#FF0000), while RGB uses decimal values (255, 0, 0). They are interchangeable in CSS." },
      { q: "When should I use HSL instead of HEX?", a: "HSL (Hue, Saturation, Lightness) is useful when you need to create color variations — changing lightness creates tints and shades, while adjusting saturation makes colors more vivid or muted." },
      { q: "Does it support transparency (alpha)?", a: "The current converter focuses on opaque colors in HEX, RGB, and HSL formats. For transparency, append an alpha value manually (e.g., rgba(59, 130, 246, 0.5))." },
      { q: "Can I use a color picker instead of typing values?", a: "Yes. The tool includes a visual color picker where you can click to select a color and see all format conversions instantly." },
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
    keywords: ["password generator", "random password generator", "secure password generator", "strong password generator", "free password generator", "password creator", "generate strong password", "cryptographic password", "password tool online", "safe password maker"],
    seoContent: {
      longDescription: "The ZamDev Password Generator creates cryptographically secure random passwords using the Web Crypto API — the same standard used by security-critical applications. Customize length, character sets (uppercase, lowercase, numbers, symbols), and exclude ambiguous characters. A real-time strength meter shows exactly how secure your password is. Your passwords are generated entirely client-side and are never stored or transmitted.",
      howItWorks: [
        "Set your desired password length using the slider (8 to 128 characters).",
        "Choose which character types to include: uppercase, lowercase, numbers, symbols.",
        "Click Generate to create a cryptographically random password instantly.",
        "Check the strength indicator to ensure your password meets security requirements.",
        "Click Copy to save the password to your clipboard."
      ],
      useCases: [
        "Creating unique passwords for new online accounts",
        "Generating master passwords for password manager vaults",
        "Creating API keys and secret tokens for development",
        "Generating secure Wi-Fi network passwords",
        "Creating strong passwords that meet specific complexity requirements",
        "Replacing weak or reused passwords with strong alternatives"
      ],
    },
    faqItems: [
      { q: "How are passwords generated?", a: "Passwords are generated using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers — the same standard used by security applications." },
      { q: "Are generated passwords stored anywhere?", a: "No. Passwords are generated entirely in your browser and never sent to any server. Once you leave the page, the password exists only if you copied it." },
      { q: "What makes a strong password?", a: "A strong password is at least 16 characters long and includes a mix of uppercase, lowercase, numbers, and symbols. The strength indicator shows you how secure your password is." },
      { q: "How long should my password be?", a: "For most accounts, 16 characters is a strong minimum. For high-security applications like password manager master passwords, 20+ characters is recommended. Each additional character exponentially increases cracking difficulty." },
      { q: "Should I include symbols in my password?", a: "Yes. Including symbols significantly increases password entropy. If a service restricts certain symbols, you can customize which character types to include in the generator settings." },
      { q: "Is this generator better than my browser's built-in password generator?", a: "Both use cryptographically secure random generation. This tool offers more customization options (character sets, length, exclusions) and works across all browsers without needing a password manager extension." },
      { q: "Can I exclude similar-looking characters?", a: "Yes. You can exclude ambiguous characters like 0/O, l/1/I that can be confused when reading passwords, which is useful for passwords you need to type manually." },
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
    keywords: ["hash generator", "sha256 generator", "sha512 generator", "sha1 hash", "online hash generator", "checksum generator", "file hash checker", "md5 alternative", "sha hash tool", "data integrity check", "hash calculator"],
    seoContent: {
      longDescription: "The ZamDev Hash Generator produces cryptographic hashes using the SHA family of algorithms — SHA-1, SHA-256, SHA-384, and SHA-512 — directly in your browser via the Web Crypto API. Enter any text and instantly get the hash digest in hexadecimal format. Use it to verify file integrity, compare checksums, generate unique identifiers, or learn about cryptographic hashing. No data leaves your device.",
      howItWorks: [
        "Enter or paste the text you want to hash in the input field.",
        "Select the hash algorithm: SHA-1, SHA-256, SHA-384, or SHA-512.",
        "The hash is generated instantly as you type using the Web Crypto API.",
        "Copy the hexadecimal hash output to your clipboard.",
        "Compare hashes to verify data integrity or detect changes."
      ],
      useCases: [
        "Verifying file integrity by comparing SHA-256 checksums",
        "Generating unique content identifiers for caching systems",
        "Creating hash-based signatures for data verification",
        "Learning how different SHA algorithms produce different digest lengths",
        "Comparing hashes to detect if data has been modified",
        "Generating deterministic IDs from string inputs"
      ],
    },
    faqItems: [
      { q: "What hash algorithms are available?", a: "The tool supports SHA-1, SHA-256, SHA-384, and SHA-512. SHA-256 is the most commonly used for general purposes, while SHA-512 offers the highest security." },
      { q: "What are hashes used for?", a: "Hashes are used to verify file integrity, store passwords securely, create digital signatures, and ensure data hasn't been tampered with." },
      { q: "Is SHA-1 still safe to use?", a: "SHA-1 has known collision vulnerabilities and is considered deprecated for security-critical applications. Use SHA-256 or SHA-512 for anything requiring cryptographic security. SHA-1 is still used for non-security checksums." },
      { q: "What is the difference between SHA-256 and SHA-512?", a: "SHA-256 produces a 256-bit (64-character hex) hash while SHA-512 produces a 512-bit (128-character hex) hash. SHA-512 is more secure but both are considered safe for current use. SHA-512 can actually be faster on 64-bit processors." },
      { q: "Can I hash files with this tool?", a: "This tool hashes text input. For file hashing, you can use command-line tools like shasum or certutil. The text hash output is identical to what command-line tools produce for the same input." },
      { q: "Can a hash be reversed to reveal the original text?", a: "No. Cryptographic hashes are one-way functions — it is computationally infeasible to reverse a hash back to its original input. This is what makes hashing useful for password storage and data integrity." },
      { q: "Why do small input changes produce completely different hashes?", a: "This is called the avalanche effect — a key property of cryptographic hash functions. Changing even a single character produces a completely different hash output, making it easy to detect any modification to the original data." },
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
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "metric converter", "imperial to metric", "kg to lbs", "miles to km", "fahrenheit to celsius", "cm to inches", "liters to gallons", "measurement converter"],
    seoContent: {
      longDescription: "The ZamDev Unit Converter handles conversions across five essential measurement categories: length, weight, temperature, volume, and speed. Convert between metric and imperial systems instantly with high-precision calculations. Whether you are converting kilometers to miles for travel, kilograms to pounds for recipes, or Celsius to Fahrenheit for weather, this tool delivers accurate results with no ads or distractions.",
      howItWorks: [
        "Select the measurement category: length, weight, temperature, volume, or speed.",
        "Choose the source unit and target unit from the dropdown menus.",
        "Enter the value you want to convert.",
        "See the converted result instantly with full decimal precision.",
        "Switch between units or categories to perform additional conversions."
      ],
      useCases: [
        "Converting recipe measurements between metric and imperial",
        "Calculating running distances between kilometers and miles",
        "Converting temperatures when traveling internationally",
        "Translating dimensions for international shipping",
        "Converting speed limits between km/h and mph",
        "Engineering calculations requiring precise unit conversions"
      ],
    },
    faqItems: [
      { q: "What unit categories are supported?", a: "You can convert between length (meters, feet, inches), weight (kg, lbs, oz), temperature (°C, °F, K), volume (liters, gallons), and speed (km/h, mph) units." },
      { q: "Are the conversions accurate?", a: "Yes. All conversions use standard mathematical formulas with full floating-point precision, giving you accurate results for both everyday and professional use." },
      { q: "How do temperature conversions work?", a: "Temperature conversions use exact formulas: °F = (°C × 9/5) + 32, K = °C + 273.15. Unlike other unit conversions which are simple multiplications, temperature requires both multiplication and addition." },
      { q: "Can I convert between metric and imperial?", a: "Yes. The tool supports full cross-system conversions — meters to feet, kilograms to pounds, liters to gallons, and all reverse conversions." },
      { q: "Does it handle very large or very small numbers?", a: "Yes. The converter handles numbers from very small (scientific notation) to very large values with full precision. Results are displayed with appropriate decimal places." },
      { q: "Is this useful for cooking and baking?", a: "Absolutely. Convert cups to milliliters, ounces to grams, and Fahrenheit to Celsius — all essential conversions for international recipes." },
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
    keywords: ["regex tester", "regular expression tester", "regex debugger", "regex validator", "test regex online", "regex pattern matcher", "regex builder", "regex cheat sheet", "regex match highlighter", "javascript regex tester"],
    seoContent: {
      longDescription: "The ZamDev Regex Tester is a real-time regular expression debugger that highlights matches as you type. Test patterns against sample text, toggle flags like global, case-insensitive, and multiline, and instantly see which parts of your text match. Whether you are writing validation patterns, parsing log files, or extracting data with capture groups, this tool provides instant visual feedback to get your regex right.",
      howItWorks: [
        "Enter your regular expression pattern in the pattern field.",
        "Type or paste test text in the input area below.",
        "Matches are highlighted in real time as you type.",
        "Toggle regex flags (g, i, m) to change matching behavior.",
        "View match details including capture groups and match positions."
      ],
      useCases: [
        "Validating email, phone number, or URL patterns",
        "Testing data extraction regex for log file parsing",
        "Building search-and-replace patterns for text editors",
        "Debugging regex patterns that behave unexpectedly",
        "Learning regex syntax with instant visual feedback",
        "Creating form validation patterns for web applications"
      ],
    },
    faqItems: [
      { q: "Does it support regex flags?", a: "Yes. You can toggle common flags like global (g), case-insensitive (i), and multiline (m) to test different matching behaviors." },
      { q: "Does it show matches in real time?", a: "Yes. As you type your regex pattern and test string, matches are highlighted instantly so you can see exactly what your pattern captures." },
      { q: "What regex syntax is supported?", a: "The tester uses JavaScript's native RegExp engine, which supports standard regex syntax including character classes, quantifiers, lookaheads, lookbehinds, capture groups, and backreferences." },
      { q: "Can I see capture groups?", a: "Yes. Each match displays its capture groups so you can verify that parenthesized subpatterns are extracting the correct segments of text." },
      { q: "Does it show why my regex fails to match?", a: "When your regex has no matches, you can see the pattern highlighted, making it easier to identify which part of the expression needs adjustment. Try building your pattern incrementally to isolate issues." },
      { q: "Can I use this for form validation regex?", a: "Absolutely. Test your email, phone, URL, and custom validation patterns against sample inputs to ensure they match valid data and reject invalid data before implementing in your application." },
    ],
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens — view header, payload, and expiry.",
    tag: "Popular",
    category: "developer",
    iconName: "KeyRound",
    keywords: ["jwt decoder", "jwt debugger", "decode jwt", "json web token decoder", "jwt parser", "jwt inspector", "jwt token viewer", "jwt expiration checker", "jwt claims viewer", "jwt payload decoder"],
    seoContent: {
      longDescription: "The ZamDev JWT Decoder lets you decode and inspect JSON Web Tokens (JWTs) instantly in your browser. Paste any JWT and see the decoded header, payload, and signature in a clean, formatted view. Check token expiration timestamps, inspect claims like issuer and audience, and verify token structure — all without sending your token to any server. Essential for debugging authentication flows in web applications.",
      howItWorks: [
        "Paste your JSON Web Token (JWT) into the input field.",
        "The token is instantly decoded into its three parts: header, payload, and signature.",
        "View the decoded header showing algorithm and token type.",
        "Inspect the payload with all claims including expiration (exp), issued-at (iat), and custom claims.",
        "Check if the token is expired based on the exp claim timestamp."
      ],
      useCases: [
        "Debugging OAuth 2.0 and OpenID Connect authentication flows",
        "Inspecting JWT claims returned by API endpoints",
        "Verifying token expiration during development and testing",
        "Understanding JWT structure when learning about web authentication",
        "Checking audience, issuer, and scope claims in access tokens",
        "Troubleshooting SSO and identity provider integrations"
      ],
    },
    faqItems: [
      { q: "Can I decode expired tokens?", a: "Yes. The decoder will decode any valid JWT regardless of its expiration status, and clearly show you the expiration timestamp so you can check if it's still valid." },
      { q: "Is it safe to paste my JWT here?", a: "Absolutely. The decoding happens entirely in your browser — no data is sent to any server. Your tokens remain private." },
      { q: "What JWT claims can I see?", a: "You can see all standard claims (iss, sub, aud, exp, nbf, iat, jti) and any custom claims included in the token payload. Each claim is displayed with its decoded value." },
      { q: "Does it validate the JWT signature?", a: "The tool decodes and displays the signature but does not validate it, as signature verification requires the secret key or public key. It focuses on decoding and inspecting token contents." },
      { q: "What is a JSON Web Token?", a: "A JWT is a compact, URL-safe token format used for securely transmitting information between parties. It consists of three Base64-encoded parts separated by dots: header, payload, and signature." },
      { q: "Can I decode tokens from any provider?", a: "Yes. JWTs follow a universal standard (RFC 7519), so tokens from Auth0, Firebase, AWS Cognito, Okta, or any other provider can be decoded with this tool." },
      { q: "Why is my token showing as invalid?", a: "Make sure you are pasting the complete token including all three parts separated by dots. JWTs should look like xxxxx.yyyyy.zzzzz. Incomplete or modified tokens will not decode properly." },
    ],
  },
  {
    id: "json-to-typescript",
    title: "JSON → TypeScript",
    description: "Generate TypeScript interfaces from JSON with nested types and arrays.",
    tag: "Popular",
    category: "developer",
    iconName: "Braces",
    keywords: ["json to typescript", "json to ts", "generate typescript interface", "json to type", "typescript interface generator", "json to ts converter", "typescript type generator", "json schema to typescript", "api response to typescript", "auto generate types"],
    seoContent: {
      longDescription: "The ZamDev JSON to TypeScript converter automatically generates clean, properly typed TypeScript interfaces from any JSON data. Paste an API response, database record, or any JSON object and get a complete set of TypeScript interfaces with correct types for strings, numbers, booleans, arrays, and nested objects. Save hours of manual type definition and reduce type errors in your TypeScript projects.",
      howItWorks: [
        "Paste your JSON data into the input editor.",
        "The tool analyzes the JSON structure and infers TypeScript types.",
        "Nested objects automatically generate separate named interfaces.",
        "Array items are typed based on their content structure.",
        "Copy the generated TypeScript interfaces and paste into your project."
      ],
      useCases: [
        "Generating types from REST API response JSON for frontend projects",
        "Creating interfaces from database query results",
        "Converting JSON configuration schemas to typed objects",
        "Speeding up TypeScript project setup with auto-generated types",
        "Ensuring type safety when consuming third-party API data",
        "Creating DTO interfaces from backend JSON endpoints"
      ],
    },
    faqItems: [
      { q: "Does it handle nested objects?", a: "Yes. The generator recursively processes nested objects and creates separate named interfaces for each level, producing clean, well-organized TypeScript code." },
      { q: "How does it handle arrays?", a: "Arrays are typed based on their contents. If an array contains objects, a separate interface is generated for the array item type." },
      { q: "Does it support optional properties?", a: "Properties present in the input JSON are generated as required by default. You can manually add the ? modifier to properties that might be optional in your actual data." },
      { q: "How does it name nested interfaces?", a: "Nested interfaces are named based on the parent property key with proper PascalCase naming. For example, a 'user' object with an 'address' field generates both User and Address interfaces." },
      { q: "Can I use the output directly in my project?", a: "Yes. The generated interfaces are valid TypeScript that you can copy and paste directly into a .ts file. They follow standard naming conventions and formatting." },
      { q: "How does it handle mixed-type arrays?", a: "If an array contains mixed types, the tool generates a union type (e.g., string | number). For arrays of objects with different shapes, it creates a merged interface containing all possible properties." },
    ],
  },
  {
    id: "yaml-json-converter",
    title: "YAML ↔ JSON Converter",
    description: "Convert between YAML and JSON formats bidirectionally.",
    tag: "New",
    category: "developer",
    iconName: "FileJson",
    keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml json converter", "convert yaml online", "yaml parser", "yaml to json online", "json to yaml online", "kubernetes yaml", "docker compose converter"],
    seoContent: {
      longDescription: "The ZamDev YAML/JSON Converter transforms data between YAML and JSON formats instantly with a single click. YAML is popular for configuration files (Kubernetes, Docker Compose, GitHub Actions) while JSON is the standard for APIs and data interchange. This tool makes switching between the two effortless — paste either format and convert to the other. Syntax errors are caught and reported instantly to help you fix malformed data.",
      howItWorks: [
        "Paste your YAML or JSON data in the input editor.",
        "Click the conversion button to convert to the opposite format.",
        "The tool detects whether the input is YAML or JSON automatically.",
        "View the converted output with proper formatting and indentation.",
        "Copy the result to your clipboard for use in your project."
      ],
      useCases: [
        "Converting Kubernetes YAML manifests to JSON for programmatic manipulation",
        "Transforming JSON API responses to YAML for configuration files",
        "Converting Docker Compose files between formats",
        "Preparing GitHub Actions workflow data in different formats",
        "Loading YAML configuration into JSON-based applications",
        "Debugging CI/CD pipeline configurations by converting between formats"
      ],
    },
    faqItems: [
      { q: "Can I convert in both directions?", a: "Yes. You can paste YAML and convert to JSON, or paste JSON and convert to YAML — the tool works bidirectionally with a single click." },
      { q: "Does it preserve comments?", a: "YAML comments are not preserved when converting to JSON, as JSON does not support comments. However, all data values and structure are accurately converted." },
      { q: "Does it handle multi-document YAML?", a: "The converter handles single-document YAML files. For multi-document YAML (files with --- separators), convert each document separately for best results." },
      { q: "What YAML features are supported?", a: "The converter supports all standard YAML features including anchors, aliases, nested objects, arrays, multi-line strings, and all scalar types (strings, numbers, booleans, null)." },
      { q: "Can I use this for Kubernetes configs?", a: "Yes. This tool is perfect for converting Kubernetes YAML manifests to JSON format, which is useful for tools and scripts that require JSON input, and vice versa." },
      { q: "How does it handle YAML indentation errors?", a: "YAML is indentation-sensitive. If your YAML has indentation errors, the converter will display a clear error message pointing to the problematic line so you can fix it." },
    ],
  },
  {
    id: "cron-parser",
    title: "Cron Expression Parser",
    description: "Parse cron expressions into human-readable schedules with next run times.",
    tag: "New",
    category: "developer",
    iconName: "Timer",
    keywords: ["cron parser", "cron expression parser", "cron job parser", "cron schedule", "cron expression generator", "crontab parser", "cron to human readable", "next cron run", "cron expression builder", "linux cron tool"],
    seoContent: {
      longDescription: "The ZamDev Cron Expression Parser translates cron expressions into plain English descriptions and calculates upcoming execution times. Whether you are scheduling backups, cleanup jobs, or automated reports, this tool helps you verify that your cron expression triggers at the exact times you intend. Supports standard 5-field cron syntax used by Linux, AWS, GitHub Actions, and all major cloud platforms.",
      howItWorks: [
        "Enter a cron expression in standard 5-field format (minute, hour, day, month, weekday).",
        "The tool instantly translates it into a human-readable English description.",
        "View the next 5-10 scheduled run times to verify the schedule.",
        "Adjust individual fields and see the description update in real time.",
        "Copy the expression for use in crontab, CI/CD configs, or task schedulers."
      ],
      useCases: [
        "Verifying cron schedules before deploying to production servers",
        "Building cron expressions for AWS CloudWatch or GitHub Actions",
        "Understanding existing cron expressions in inherited codebases",
        "Scheduling database backup scripts with precise timing",
        "Setting up automated report generation at specific intervals",
        "Learning cron syntax with real-time feedback"
      ],
    },
    faqItems: [
      { q: "What cron format is supported?", a: "The parser supports standard 5-field cron expressions (minute, hour, day-of-month, month, day-of-week) used by most Unix/Linux systems and cloud platforms." },
      { q: "Does it show when the cron job runs next?", a: "Yes. The tool calculates and displays the next several scheduled run times based on your cron expression, so you can verify your schedule is correct." },
      { q: "What does * mean in a cron expression?", a: "The asterisk (*) means 'every' value for that field. For example, * in the minute field means the job runs every minute. In the hour field, it means every hour." },
      { q: "How do I schedule a job to run every 5 minutes?", a: "Use */5 * * * * to run every 5 minutes. The */5 in the minute field means every 5th minute. You can use this pattern with any interval." },
      { q: "What is the difference between 5-field and 6-field cron?", a: "Standard 5-field cron uses minute, hour, day, month, weekday. Some systems add a 6th field for seconds (e.g., Spring). This tool supports the standard 5-field format." },
      { q: "Can I use named values like MON or JAN?", a: "The tool primarily works with numeric values. Use 1-7 for days of the week (1=Monday) and 1-12 for months. Some cron implementations accept names, but numeric values are universally supported." },
    ],
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format, minify, and beautify SQL queries with keyword uppercasing.",
    tag: "New",
    category: "developer",
    iconName: "Database",
    keywords: ["sql formatter", "sql beautifier", "format sql online", "sql pretty print", "sql minifier", "sql indenter", "sql query formatter", "format select query", "sql code formatter", "sql syntax highlighter"],
    seoContent: {
      longDescription: "The ZamDev SQL Formatter transforms messy, single-line SQL queries into clean, properly indented, and readable SQL statements. It handles SELECT, INSERT, UPDATE, DELETE, and complex JOINs, subqueries, and CTEs. SQL keywords are automatically uppercased for readability while table and column names retain their original case. You can also minify formatted SQL into a compact single line for embedding in application code.",
      howItWorks: [
        "Paste your SQL query into the input editor.",
        "Click Format to beautify with proper indentation and keyword uppercasing.",
        "Use Minify to compress the query into a single line.",
        "Copy the formatted or minified output to your clipboard.",
        "Repeat with additional queries — the tool handles any SQL complexity."
      ],
      useCases: [
        "Formatting complex JOIN queries for code review readability",
        "Beautifying auto-generated SQL from ORM query logs",
        "Minifying SQL for embedding in application code strings",
        "Cleaning up legacy database queries for documentation",
        "Formatting stored procedure code for better maintainability",
        "Standardizing SQL style across a development team"
      ],
    },
    faqItems: [
      { q: "What SQL dialects are supported?", a: "The formatter handles standard SQL syntax that works across MySQL, PostgreSQL, SQLite, and SQL Server. It automatically uppercases SQL keywords for readability." },
      { q: "Can I minify SQL?", a: "Yes. Besides beautifying, you can also minify SQL queries into a single line, which is useful for embedding in code or reducing payload size." },
      { q: "Does it handle subqueries and CTEs?", a: "Yes. The formatter correctly indents subqueries, Common Table Expressions (WITH clauses), UNION statements, and nested SELECT queries with proper hierarchical formatting." },
      { q: "Does it modify my query logic?", a: "No. The formatter only changes whitespace and keyword casing. Your query logic, table names, column names, and values remain exactly as you wrote them." },
      { q: "Can I format stored procedures?", a: "The formatter handles standard SQL statements. For complex stored procedures with procedural logic (IF/ELSE, loops), it will format the SQL portions while preserving the overall structure." },
      { q: "Does it support JOINs and complex queries?", a: "Yes. JOIN clauses (INNER, LEFT, RIGHT, FULL, CROSS), WHERE conditions, GROUP BY, HAVING, ORDER BY, and LIMIT are all formatted with proper indentation and line breaks." },
    ],
  },
  {
    id: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description: "Encode and decode HTML entities with a built-in reference table.",
    tag: "Client-side",
    category: "developer",
    iconName: "Code2",
    keywords: ["html entity encoder", "html entity decoder", "html entities", "encode html", "decode html entities", "html special characters", "html escape tool", "xss prevention", "html character codes", "html symbols"],
    seoContent: {
      longDescription: "The ZamDev HTML Entity Encoder converts special characters to their HTML entity equivalents and back. Characters like <, >, &, and quotes have special meaning in HTML — encoding them prevents rendering issues and helps protect against XSS (cross-site scripting) vulnerabilities. The built-in reference table provides quick access to hundreds of HTML entities for special symbols, currency signs, arrows, and mathematical notation.",
      howItWorks: [
        "Enter text containing special characters in the input field.",
        "Click Encode to convert characters like <, >, & to HTML entities.",
        "Click Decode to convert HTML entities back to readable characters.",
        "Browse the reference table to find entity codes for special symbols.",
        "Copy the encoded or decoded output to use in your HTML code."
      ],
      useCases: [
        "Encoding user input before displaying in HTML to prevent XSS",
        "Displaying code snippets in web pages without rendering issues",
        "Looking up HTML entity codes for special characters and symbols",
        "Encoding content for safe inclusion in HTML email templates",
        "Converting XML/HTML entities in API responses to readable text",
        "Safely embedding special characters in CMS content"
      ],
    },
    faqItems: [
      { q: "What are HTML entities?", a: "HTML entities are special codes that represent reserved characters in HTML (like <, >, &) or special symbols (like ©, €, →). Encoding them prevents rendering issues and XSS vulnerabilities." },
      { q: "Does it include a reference table?", a: "Yes. The tool includes a comprehensive reference table of common HTML entities so you can quickly look up the code for any character you need." },
      { q: "Why should I encode HTML entities?", a: "Encoding prevents browsers from interpreting special characters as HTML markup. This is essential for displaying code examples, preventing XSS attacks, and ensuring text renders correctly in all browsers." },
      { q: "What is the difference between named and numeric entities?", a: "Named entities use readable names like &amp; for &. Numeric entities use numbers like &#38; for the same character. Both work identically in browsers, but named entities are more readable in source code." },
      { q: "Does it handle Unicode characters?", a: "Yes. The encoder handles all Unicode characters, converting them to numeric HTML entities when they fall outside the standard ASCII range." },
      { q: "Can I use this to prevent XSS attacks?", a: "Encoding HTML entities is one layer of XSS prevention. It converts characters like < and > to &lt; and &gt; so they display as text rather than being interpreted as HTML tags. Always use server-side sanitization as well." },
    ],
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description: "Generate SEO meta tags, Open Graph, and Twitter Card markup with preview.",
    tag: "Popular",
    category: "developer",
    iconName: "Globe",
    keywords: ["meta tag generator", "seo meta tags", "open graph generator", "twitter card generator", "meta description generator", "og tags generator", "social media meta tags", "seo tags tool", "html meta tags", "website seo tags"],
    seoContent: {
      longDescription: "The ZamDev Meta Tag Generator creates complete SEO meta tag markup including standard HTML meta tags, Open Graph (OG) tags for Facebook and LinkedIn, and Twitter Card tags. Fill in your page title, description, and URL, then see a live preview showing exactly how your page will appear in Google search results and social media shares. Copy the generated HTML code and paste it into your page's <head> section for instant SEO improvement.",
      howItWorks: [
        "Enter your page title, description, keywords, and URL in the form fields.",
        "Add Open Graph image URL and Twitter handle for social media optimization.",
        "Preview how your page will appear in Google search results.",
        "Preview how your page will look when shared on Facebook, LinkedIn, and Twitter.",
        "Copy the complete HTML meta tag code to paste into your page's head section."
      ],
      useCases: [
        "Setting up SEO meta tags for new website pages",
        "Optimizing social media sharing previews for blog posts",
        "Generating Open Graph tags for marketing landing pages",
        "Creating Twitter Card markup for content sharing",
        "Ensuring consistent meta tags across a multi-page website",
        "Previewing and testing meta tag appearance before deployment"
      ],
    },
    faqItems: [
      { q: "What meta tags does it generate?", a: "It generates standard SEO meta tags (title, description, keywords), Open Graph tags for Facebook/LinkedIn sharing, Twitter Card tags, and canonical URL tags." },
      { q: "Can I preview how my page will look in search results?", a: "Yes. The tool includes a live preview showing how your page will appear in Google search results and when shared on social media platforms." },
      { q: "What is Open Graph and why does it matter?", a: "Open Graph (OG) tags control how your page appears when shared on Facebook, LinkedIn, and other social platforms. Without them, social platforms may show the wrong title, description, or image." },
      { q: "What is the ideal meta description length?", a: "Google typically displays 150-160 characters of your meta description in search results. Keep your description within this range and make sure the most important information comes first." },
      { q: "Do meta keywords still affect SEO?", a: "Google officially ignores the meta keywords tag for ranking. However, some other search engines and SEO tools still reference them. Focus your SEO efforts on title tags, descriptions, and quality content." },
      { q: "What Twitter Card type should I use?", a: "Use 'summary_large_image' for pages with a hero image or visual content, and 'summary' for text-heavy pages. The large image card gets more engagement on Twitter/X." },
      { q: "Can I use the same meta tags on every page?", a: "Each page should have unique title and description tags. Duplicate meta tags can hurt SEO rankings because search engines may not know which page to show for a given query." },
    ],
  },
  {
    id: "chmod-calculator",
    title: "Chmod Calculator",
    description: "Calculate Unix file permissions in numeric and symbolic notation.",
    tag: "New",
    category: "developer",
    iconName: "Terminal",
    keywords: ["chmod calculator", "file permissions calculator", "unix permissions", "linux chmod", "permission calculator", "chmod 755", "chmod 644", "file permission tool", "rwx calculator", "linux file permissions"],
    seoContent: {
      longDescription: "The ZamDev Chmod Calculator helps you understand and set Unix/Linux file permissions by converting between numeric (octal) and symbolic (rwx) notation. Click checkboxes for read, write, and execute permissions for owner, group, and others — and see the numeric and symbolic equivalents update in real time. Essential for system administrators, DevOps engineers, and anyone deploying applications on Linux servers.",
      howItWorks: [
        "Toggle read (r), write (w), and execute (x) checkboxes for owner, group, and others.",
        "See the numeric (e.g., 755) and symbolic (e.g., rwxr-xr-x) notation update instantly.",
        "Or enter a numeric value to see the corresponding permission checkboxes.",
        "Copy the chmod command to use in your terminal.",
        "Reference common permission presets for quick selection."
      ],
      useCases: [
        "Setting correct permissions for web server files (644) and directories (755)",
        "Understanding permission requirements in deployment documentation",
        "Debugging file access errors on Linux servers",
        "Learning Unix file permissions for system administration",
        "Configuring SSH key file permissions (600)",
        "Setting executable permissions for shell scripts and binaries"
      ],
    },
    faqItems: [
      { q: "What's the difference between numeric and symbolic notation?", a: "Numeric notation uses three digits (e.g., 755), where each digit represents permissions for owner, group, and others. Symbolic notation uses letters like rwxr-xr-x to represent the same permissions." },
      { q: "What does chmod 755 mean?", a: "chmod 755 gives the owner full permissions (read, write, execute) and gives the group and others read and execute permissions only. It's the most common permission for web server files." },
      { q: "What are the most common chmod values?", a: "644 (owner read/write, others read) for regular files, 755 (owner all, others read/execute) for directories and scripts, 600 (owner read/write only) for sensitive files like SSH keys." },
      { q: "What does the execute permission do on directories?", a: "On directories, execute (x) permission means the ability to access and traverse the directory. Without it, users cannot cd into the directory or access any files within it, even if they have read permission." },
      { q: "What is the sticky bit?", a: "The sticky bit (represented by 't' or numeric prefix 1) on a directory means only the file owner can delete or rename files within it. It's commonly used on /tmp directories. For example, chmod 1755 sets sticky on a directory." },
      { q: "How do I make a script executable?", a: "Use chmod 755 for scripts that everyone should run, or chmod 700 for scripts only the owner should execute. The key is adding the execute (x) permission for the appropriate users." },
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
    keywords: ["text minifier", "html minifier", "css minifier", "javascript minifier", "code minifier", "compress code", "minify html online", "minify css online", "minify js online", "code compressor", "reduce file size"],
    seoContent: {
      longDescription: "The ZamDev Text Minifier compresses HTML, CSS, and JavaScript code by removing unnecessary whitespace, comments, and formatting — reducing file sizes by 20-60% without changing functionality. Smaller files mean faster page loads, less bandwidth usage, and improved Core Web Vitals scores. Paste your code, choose the language, and get optimized output instantly. All processing happens in your browser.",
      howItWorks: [
        "Paste your HTML, CSS, or JavaScript code into the input editor.",
        "Select the code language for optimized minification.",
        "Click Minify to remove whitespace, comments, and unnecessary characters.",
        "See the size reduction percentage and compare before/after.",
        "Copy the minified output for use in your production builds."
      ],
      useCases: [
        "Minifying CSS and JavaScript for production website deployment",
        "Reducing inline HTML email template code size",
        "Compressing embedded CSS in HTML files",
        "Quick minification without build tool setup",
        "Reducing code size for CDN-hosted assets",
        "Optimizing WordPress theme files for faster loading"
      ],
    },
    faqItems: [
      { q: "What languages can I minify?", a: "You can minify HTML, CSS, and JavaScript code. The minifier removes whitespace, comments, and unnecessary characters to reduce file size." },
      { q: "How much smaller will my code be?", a: "Reduction varies by code style, but typically you can expect 20-60% size reduction. Code with lots of comments and formatting will see the biggest savings." },
      { q: "Does minification break my code?", a: "No. Minification only removes whitespace, comments, and shortens syntax where safe. The functionality of your code remains identical after minification." },
      { q: "Should I minify code for production?", a: "Yes. Minified code loads faster because browsers download smaller files. Most production websites serve minified CSS and JavaScript, and it's considered a web performance best practice." },
      { q: "Can I un-minify (beautify) code?", a: "This tool focuses on minification. For formatting/beautifying minified code, use language-specific formatters like our JSON Formatter or SQL Formatter tools." },
      { q: "Does it handle CSS preprocessor output?", a: "Yes. The minifier works on compiled CSS output from Sass, Less, or PostCSS. It processes standard CSS syntax regardless of how it was originally authored." },
    ],
  },
  {
    id: "base64-converter",
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
    tag: "Client-side",
    category: "text",
    iconName: "Shield",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "encode base64", "decode base64", "base64 to text", "text to base64", "image to base64", "base64 online tool", "file to base64", "base64 string converter"],
    seoContent: {
      longDescription: "The ZamDev Base64 Converter encodes text and files to Base64 format and decodes Base64 strings back to their original content. Base64 encoding is essential for embedding images in CSS/HTML, encoding email attachments, transmitting binary data in JSON APIs, and working with data URIs. The tool handles both text and file input, supports encoding and decoding, and processes everything client-side for privacy.",
      howItWorks: [
        "Enter text or upload a file you want to encode to Base64.",
        "Click Encode to convert the input to a Base64 string.",
        "Or paste a Base64 string and click Decode to reveal the original content.",
        "Copy the encoded or decoded output with one click.",
        "Use the Base64 output for data URIs, API payloads, or email encoding."
      ],
      useCases: [
        "Embedding small images as Base64 data URIs in HTML/CSS",
        "Encoding API authentication credentials for HTTP headers",
        "Decoding Base64-encoded email attachments",
        "Converting binary data for transmission in JSON payloads",
        "Encoding configuration values for environment variables",
        "Decoding Base64-encoded JWT token parts for debugging"
      ],
    },
    faqItems: [
      { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. It's commonly used for embedding images in CSS/HTML, encoding email attachments, and transmitting binary data in text-based protocols." },
      { q: "Can I encode files?", a: "Yes. You can encode both text strings and files (like images) to Base64, and decode Base64 strings back to their original form." },
      { q: "Is Base64 encryption?", a: "No. Base64 is encoding, not encryption. It does not provide security — anyone can decode a Base64 string. It's used for data representation, not data protection." },
      { q: "Why are Base64 strings longer than the original?", a: "Base64 encoding increases data size by approximately 33%. Three bytes of binary data become four Base64 characters. This overhead is the trade-off for being able to represent binary data as safe ASCII text." },
      { q: "What is a data URI?", a: "A data URI embeds file content directly in HTML/CSS using Base64. For example: data:image/png;base64,iVBOR... This eliminates an HTTP request for small assets like icons." },
      { q: "When should I use Base64 for images vs regular image files?", a: "Use Base64 data URIs for very small images (under 5KB) like icons to save HTTP requests. For larger images, regular file references are better because Base64 increases size by 33% and cannot be cached independently." },
    ],
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs and URI components.",
    tag: "New",
    category: "text",
    iconName: "Link",
    keywords: ["url encoder", "url decoder", "encode url", "decode url", "uri encoder", "percent encoding", "url decode online", "url encode online", "uri component encoder", "url special characters"],
    seoContent: {
      longDescription: "The ZamDev URL Encoder/Decoder converts special characters in URLs to their percent-encoded equivalents and back. When URLs contain spaces, ampersands, non-ASCII characters, or other special symbols, they must be encoded for proper transmission across the internet. This tool handles both full URL encoding (encodeURI) and component encoding (encodeURIComponent) so you always get the right encoding for your use case.",
      howItWorks: [
        "Paste a URL or text string containing special characters.",
        "Choose between full URL encoding or URI component encoding.",
        "Click Encode to convert special characters to percent-encoded format.",
        "Or paste an encoded URL and click Decode to reveal the original.",
        "Copy the result for use in APIs, query strings, or web applications."
      ],
      useCases: [
        "Encoding query parameter values containing special characters",
        "Decoding percent-encoded URLs from logs or analytics",
        "Preparing URLs with Unicode characters for safe transmission",
        "Building redirect URLs with properly encoded parameters",
        "Debugging URL encoding issues in web applications",
        "Encoding file paths for use in URLs"
      ],
    },
    faqItems: [
      { q: "When do I need URL encoding?", a: "URL encoding is needed when your URL contains special characters like spaces, &, =, or non-ASCII characters. Encoding ensures the URL is transmitted correctly across the internet." },
      { q: "What's the difference between URL and URI encoding?", a: "URL encoding (encodeURI) encodes a full URL preserving special URL characters. URI component encoding (encodeURIComponent) encodes everything, suitable for query parameter values." },
      { q: "How are spaces encoded?", a: "Spaces can be encoded as %20 (standard percent-encoding) or + (application/x-www-form-urlencoded). The tool uses %20 which is universally compatible across all URL contexts." },
      { q: "What characters need encoding?", a: "Characters like spaces, <, >, {, }, |, \\, ^, ~, [, ], `, and all non-ASCII characters require encoding. Characters like ?, &, =, and # have special meaning in URLs and need encoding when used in parameter values." },
      { q: "Can I decode URLs with Unicode characters?", a: "Yes. The decoder handles percent-encoded Unicode characters (like %E4%B8%AD for Chinese characters) and displays the original characters correctly." },
      { q: "Why does my URL break when it has special characters?", a: "URLs can only contain a limited set of ASCII characters. Special characters must be percent-encoded (%XX format) so web servers and browsers interpret the URL correctly. This tool handles that conversion for you." },
    ],
  },
  {
    id: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences line by line.",
    tag: "New",
    category: "text",
    iconName: "AlignLeft",
    keywords: ["text diff checker", "compare text", "text comparison tool", "diff checker online", "find differences in text", "text compare", "side by side diff", "online diff tool", "code comparison", "file diff"],
    seoContent: {
      longDescription: "The ZamDev Text Diff Checker compares two blocks of text side by side and highlights every difference with color-coded annotations. Added lines are shown in green, removed lines in red, and unchanged lines in neutral. Whether you are comparing code versions, contract revisions, or configuration file changes, this tool makes it easy to spot exactly what changed between two versions.",
      howItWorks: [
        "Paste the original text in the left panel.",
        "Paste the modified text in the right panel.",
        "Click Compare to generate the diff view.",
        "Additions are highlighted in green, deletions in red.",
        "Scroll through the diff to review every change."
      ],
      useCases: [
        "Comparing code changes before a commit or code review",
        "Reviewing contract or legal document revisions",
        "Comparing configuration file versions across environments",
        "Checking content changes between CMS draft and published versions",
        "Verifying data migration accuracy by comparing exports",
        "Reviewing translated documents against originals"
      ],
    },
    faqItems: [
      { q: "How are differences shown?", a: "Differences are highlighted line by line with color coding — added lines in green, removed lines in red, and unchanged lines in their normal color." },
      { q: "Can I compare large texts?", a: "Yes. The diff checker handles large texts efficiently. For very large documents, processing may take a moment but works reliably in modern browsers." },
      { q: "Does it compare character-by-character or line-by-line?", a: "The tool performs line-by-line comparison, which is the most common and useful diff mode. Each line is identified as added, removed, or unchanged." },
      { q: "Can I compare code files?", a: "Yes. The diff checker works with any text including source code, configuration files, JSON, XML, and plain text. It treats the input as plain text regardless of language." },
      { q: "Does it handle whitespace differences?", a: "Yes. The tool detects all changes including whitespace differences (spaces, tabs, line endings). This is important for configuration files where whitespace matters." },
      { q: "Can I compare files directly?", a: "Currently you paste text content into both panels. To compare files, open them in a text editor, copy the contents, and paste into the tool." },
    ],
  },
  {
    id: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts.",
    tag: "Client-side",
    category: "text",
    iconName: "TextIcon",
    keywords: ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "lipsum generator", "generate lorem ipsum", "filler text", "sample text generator", "design placeholder text", "blind text generator", "mock text"],
    seoContent: {
      longDescription: "The ZamDev Lorem Ipsum Generator creates placeholder text in various quantities and formats for designers, developers, and content creators. Choose between paragraphs, sentences, or individual words, and specify exactly how much text you need. Lorem Ipsum has been the industry-standard dummy text since the 1500s — it looks like readable English without distracting from the visual design of a layout.",
      howItWorks: [
        "Select the output format: paragraphs, sentences, or words.",
        "Choose the number of units to generate.",
        "Click Generate to create the placeholder text.",
        "Copy the generated text to your clipboard.",
        "Paste it into your design mockup, website template, or document."
      ],
      useCases: [
        "Filling design mockups with realistic-looking text",
        "Testing website layouts with varying content lengths",
        "Populating CMS templates during development",
        "Creating presentation slides with placeholder content",
        "Testing print layouts with dummy body text",
        "Filling email templates during design review"
      ],
    },
    faqItems: [
      { q: "What output options are available?", a: "You can generate paragraphs, sentences, or words of Lorem Ipsum text. Customize the quantity to get exactly the amount of placeholder text you need." },
      { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is standard placeholder text used in the printing and design industry since the 1500s. It helps designers visualize how real text will look in a layout without the distraction of meaningful content." },
      { q: "Why use Lorem Ipsum instead of random text?", a: "Lorem Ipsum has a natural distribution of letters and word lengths that mimics real language. This provides a more realistic visual representation of how the final content will look compared to repeating 'test test test'." },
      { q: "Can I generate a specific number of words?", a: "Yes. Switch to word mode and specify the exact number of words you need. This is useful when testing layouts with specific word count requirements." },
      { q: "Is Lorem Ipsum real Latin?", a: "It's derived from a 45 BC text by Cicero, but the standard Lorem Ipsum passage has been altered and scrambled over the centuries. Some fragments are real Latin while others are pseudo-Latin." },
      { q: "How much text should I generate for a blog post mockup?", a: "A typical blog post is 600-1500 words or 4-8 paragraphs. For article previews or card layouts, 1-2 sentences is usually sufficient." },
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
    keywords: ["timestamp converter", "unix timestamp converter", "epoch converter", "date to timestamp", "timestamp to date", "epoch to date", "unix time converter", "utc timestamp", "time converter online", "epoch time calculator"],
    seoContent: {
      longDescription: "The ZamDev Timestamp Converter translates between Unix timestamps (epoch time) and human-readable dates with full timezone support. Unix timestamps are the universal time format used in programming, databases, and APIs — representing seconds elapsed since January 1, 1970 (UTC). Enter a timestamp to see the date, or pick a date to get the timestamp. Essential for debugging time-related issues in applications.",
      howItWorks: [
        "Enter a Unix timestamp (seconds since epoch) to see the human-readable date.",
        "Or select a date and time to calculate the corresponding Unix timestamp.",
        "Toggle between UTC and your local timezone.",
        "View the timestamp in multiple formats: seconds, milliseconds, and ISO 8601.",
        "Copy any format to your clipboard with a single click."
      ],
      useCases: [
        "Debugging API responses that use Unix timestamps",
        "Converting database timestamp columns to readable dates",
        "Calculating time differences between events in epoch format",
        "Setting expiration times for tokens and cache entries",
        "Understanding JWT token exp and iat claim values",
        "Converting log file timestamps for incident analysis"
      ],
    },
    faqItems: [
      { q: "What is a Unix timestamp?", a: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (UTC). It's widely used in programming and databases to represent dates and times." },
      { q: "Does it support different timezones?", a: "Yes. You can convert timestamps to and from different timezones, including UTC and your local timezone." },
      { q: "What is the difference between seconds and milliseconds timestamps?", a: "Unix timestamps in seconds are 10 digits (e.g., 1709078400). Millisecond timestamps are 13 digits (e.g., 1709078400000). JavaScript's Date.now() returns milliseconds, while most Unix systems use seconds." },
      { q: "What is the Year 2038 problem?", a: "Systems using 32-bit signed integers for Unix timestamps will overflow on January 19, 2038. Modern systems use 64-bit integers which extend the range far beyond practical need. This tool handles dates well beyond 2038." },
      { q: "Can I get the current timestamp?", a: "Yes. The tool displays the current Unix timestamp which updates automatically. You can copy it instantly for use in your code or API calls." },
      { q: "How do I convert ISO 8601 dates?", a: "Enter an ISO 8601 date string (like 2024-03-15T10:30:00Z) and the tool converts it to a Unix timestamp. It handles both UTC (Z suffix) and timezone offset formats." },
    ],
  },
  {
    id: "uuid-generator",
    title: "UUID / ID Generator",
    description: "Generate cryptographically secure UUIDs, NanoIDs, and ULID-like identifiers.",
    tag: "Secure",
    category: "utility",
    iconName: "Fingerprint",
    keywords: ["uuid generator", "nanoid generator", "unique id generator", "guid generator", "random id generator", "uuid v4 generator", "ulid generator", "generate uuid online", "unique identifier", "random string generator"],
    seoContent: {
      longDescription: "The ZamDev UUID/ID Generator creates cryptographically secure unique identifiers in three popular formats: UUID v4 (standard 36-character identifiers), NanoID (compact, URL-friendly IDs), and ULID-like identifiers (sortable, timestamp-based IDs). All IDs are generated using the Web Crypto API for true randomness. Generate single IDs or batches, and copy them directly for use in databases, APIs, or application code.",
      howItWorks: [
        "Select the ID type: UUID v4, NanoID, or ULID.",
        "Choose how many IDs to generate (1 to 100).",
        "Click Generate to create cryptographically secure identifiers.",
        "Copy individual IDs or the entire batch to your clipboard.",
        "Use the generated IDs in your database, API, or application."
      ],
      useCases: [
        "Creating primary keys for database records",
        "Generating unique session tokens for web applications",
        "Creating file names that won't conflict in storage systems",
        "Generating correlation IDs for distributed system tracing",
        "Creating unique identifiers for API resources",
        "Testing applications that require unique ID inputs"
      ],
    },
    faqItems: [
      { q: "What types of IDs can I generate?", a: "You can generate UUID v4 (standard 36-character universally unique identifiers), NanoID (shorter, URL-friendly IDs), and ULID-like identifiers (sortable, timestamp-based IDs)." },
      { q: "Are the generated IDs truly unique?", a: "Yes. All IDs are generated using the Web Crypto API which provides cryptographically secure random values. The probability of collision is astronomically low." },
      { q: "When should I use UUID vs NanoID vs ULID?", a: "Use UUID v4 for standard database primary keys and interoperability. Use NanoID when you need shorter, URL-friendly IDs (e.g., for user-facing URLs). Use ULID when you need IDs that sort chronologically." },
      { q: "How long is each ID type?", a: "UUID v4 is 36 characters (with hyphens) like 550e8400-e29b-41d4-a716-446655440000. NanoID defaults to 21 characters like V1StGXR8_Z5jdHi6B-myT. ULID is 26 characters like 01ARZ3NDEKTSV4RRFFQ69G5FAV." },
      { q: "Can I generate multiple IDs at once?", a: "Yes. You can generate batches of up to 100 IDs at once. All generated IDs can be copied individually or as a group." },
      { q: "Are UUIDs globally unique?", a: "Yes. UUID v4 uses 122 bits of randomness, giving over 5.3 × 10³⁶ possible values. The chance of generating two identical UUIDs is effectively zero — you could generate a billion per second for 85 years before having a 50% chance of a single collision." },
      { q: "Can I use these as database primary keys?", a: "Yes. UUID v4 and ULID are excellent primary keys. ULIDs are particularly good because their time-based sorting improves database index performance compared to fully random UUIDs." },
    ],
  },
  {
    id: "css-gradient-generator",
    title: "CSS Gradient Generator",
    description: "Create linear, radial, and conic CSS gradients with live preview.",
    tag: "New",
    category: "utility",
    iconName: "Paintbrush",
    keywords: ["css gradient generator", "gradient maker", "linear gradient", "radial gradient", "css gradient tool", "conic gradient", "gradient css code", "background gradient generator", "css gradient builder", "tailwind gradient"],
    seoContent: {
      longDescription: "The ZamDev CSS Gradient Generator creates beautiful linear, radial, and conic gradients with a visual builder and live preview. Adjust colors, direction, and color stop positions interactively, then copy the production-ready CSS code. From subtle background fades to vibrant multi-color effects, design gradients that match your brand without writing CSS by hand. The generated code includes vendor prefixes for maximum browser compatibility.",
      howItWorks: [
        "Select the gradient type: linear, radial, or conic.",
        "Choose colors for gradient stops and adjust their positions.",
        "Set the gradient angle or direction for linear gradients.",
        "Preview the gradient in real time as you adjust settings.",
        "Copy the generated CSS code and paste into your stylesheet."
      ],
      useCases: [
        "Designing hero section backgrounds with gradient overlays",
        "Creating button hover effects with smooth color transitions",
        "Building branded background patterns for marketing pages",
        "Adding depth to card components with subtle gradients",
        "Creating gradient text effects for headings",
        "Designing gradient borders and decorative elements"
      ],
    },
    faqItems: [
      { q: "What gradient types are supported?", a: "You can create linear, radial, and conic CSS gradients. Each type offers different controls for direction, shape, and color stop positions." },
      { q: "Can I copy the CSS code?", a: "Yes. The generated CSS gradient code is ready to copy and paste directly into your stylesheet. It includes vendor prefixes for maximum browser compatibility." },
      { q: "How many color stops can I add?", a: "You can add multiple color stops to create complex, multi-color gradients. Each stop can have its own color and position percentage along the gradient." },
      { q: "Can I set the gradient angle?", a: "Yes. For linear gradients, you can set any angle from 0 to 360 degrees, or use directional keywords like 'to right', 'to bottom-left', etc." },
      { q: "Do gradients work in all browsers?", a: "CSS gradients are supported in all modern browsers. The tool generates vendor-prefixed code for broader compatibility, including older browser versions." },
      { q: "Can I use gradients with Tailwind CSS?", a: "Yes. You can use the gradient CSS in Tailwind's arbitrary value syntax like bg-[linear-gradient(...)] or add it to your custom CSS alongside Tailwind classes." },
    ],
  },
  {
    id: "css-box-shadow-generator",
    title: "CSS Box Shadow Generator",
    description: "Create multi-layer box shadows with live preview and presets.",
    tag: "New",
    category: "utility",
    iconName: "Square",
    keywords: ["css box shadow generator", "box shadow maker", "css shadow tool", "shadow generator online", "box shadow css", "drop shadow generator", "css shadow builder", "inner shadow", "card shadow css", "material design shadow"],
    seoContent: {
      longDescription: "The ZamDev CSS Box Shadow Generator lets you create sophisticated box shadow effects with an intuitive visual builder. Stack multiple shadow layers to achieve realistic depth, adjust offset, blur, spread, and color for each layer, and preview the result in real time. Professional presets (subtle, medium, large, inner shadow) provide quick starting points. Copy the production-ready CSS and use it in any web project.",
      howItWorks: [
        "Choose a preset shadow style or start from scratch.",
        "Adjust shadow properties: horizontal offset, vertical offset, blur radius, spread radius.",
        "Pick a shadow color and set the opacity.",
        "Add multiple shadow layers for complex effects.",
        "Copy the generated CSS box-shadow property value."
      ],
      useCases: [
        "Adding elevation and depth to card components",
        "Creating Material Design-style elevation shadows",
        "Designing button hover shadows for interactive feedback",
        "Building glass-morphism effects with layered shadows",
        "Adding inner shadows for input field styling",
        "Creating realistic drop shadows for modals and dialogs"
      ],
    },
    faqItems: [
      { q: "Can I add multiple shadow layers?", a: "Yes. You can stack multiple shadow layers to create complex, realistic shadow effects. Each layer has independent settings for offset, blur, spread, and color." },
      { q: "Are there pre-made shadow presets?", a: "Yes. Several professionally designed presets are available as starting points, including subtle, medium, large, and inner shadow styles." },
      { q: "What is the difference between blur and spread?", a: "Blur radius controls how soft/diffused the shadow edge is. Spread radius expands or contracts the shadow size. A positive spread makes the shadow larger than the element, negative makes it smaller." },
      { q: "How do I create an inner shadow?", a: "Add the 'inset' keyword to your shadow. The tool has an inset toggle that switches between outer and inner shadows, creating a recessed/pressed effect." },
      { q: "What shadow values does Material Design use?", a: "Material Design uses multi-layer shadows to simulate paper elevation. Level 1 uses soft, small shadows while level 24 uses larger, more diffused shadows. The presets include Material-inspired options." },
      { q: "Do box shadows affect performance?", a: "Simple box shadows have minimal performance impact. However, very large blur values or many shadow layers can increase rendering time. For best performance, keep blur values under 40px and limit to 2-3 layers." },
    ],
  },
  {
    id: "aspect-ratio-calculator",
    title: "Aspect Ratio Calculator",
    description: "Calculate dimensions and ratios for video, photos, and responsive design.",
    tag: "New",
    category: "utility",
    iconName: "Ratio",
    keywords: ["aspect ratio calculator", "image ratio calculator", "video aspect ratio", "screen resolution calculator", "dimension calculator", "16:9 calculator", "4:3 ratio", "aspect ratio converter", "image dimension calculator", "responsive design ratio"],
    seoContent: {
      longDescription: "The ZamDev Aspect Ratio Calculator helps you calculate dimensions, aspect ratios, and resize values for video, photography, and responsive web design. Enter any two dimensions to find the ratio, or lock a ratio and calculate the missing dimension. Includes common presets for widescreen (16:9), traditional (4:3), square (1:1), and ultrawide (21:9) formats. Perfect for video production, responsive CSS, and social media content creation.",
      howItWorks: [
        "Enter width and height to calculate the aspect ratio.",
        "Or select a preset ratio and enter one dimension to calculate the other.",
        "Lock the ratio to maintain proportions while adjusting dimensions.",
        "See results in both ratio format (16:9) and decimal format (1.778).",
        "Use the calculated dimensions in your design, video, or CSS."
      ],
      useCases: [
        "Calculating dimensions for video exports in 16:9 or 4:3 formats",
        "Sizing images for responsive website layouts",
        "Calculating social media image dimensions (Instagram, Facebook, YouTube)",
        "Planning screen resolutions for app and game development",
        "Resizing images while maintaining proportions",
        "Setting CSS aspect-ratio property values for responsive containers"
      ],
    },
    faqItems: [
      { q: "What can I calculate with this tool?", a: "Enter any two dimensions (width and height) to calculate the aspect ratio. You can also lock a ratio and calculate the missing dimension based on one known value." },
      { q: "What are common aspect ratios?", a: "Common ratios include 16:9 (widescreen video), 4:3 (traditional TV), 1:1 (square/Instagram), 9:16 (vertical/mobile video), and 21:9 (ultrawide)." },
      { q: "What aspect ratio does YouTube use?", a: "YouTube's standard player uses 16:9 (1920×1080, 1280×720). YouTube Shorts use 9:16 (1080×1920). Uploading in these ratios ensures your video fills the player without black bars." },
      { q: "What ratio should I use for Instagram?", a: "Instagram supports 1:1 (square, 1080×1080), 4:5 (portrait, 1080×1350), and 1.91:1 (landscape, 1080×566). Portrait 4:5 gets the most screen real estate in the feed." },
      { q: "How does the CSS aspect-ratio property work?", a: "The CSS aspect-ratio property (e.g., aspect-ratio: 16/9) forces an element to maintain a specific ratio. This is useful for responsive video containers, image placeholders, and layout components." },
      { q: "What ratio is best for printing photos?", a: "Standard photo prints use 3:2 (4×6 inches), 5:4 (8×10 inches), or 7:5 (5×7 inches). If your camera shoots in 3:2, printing in standard sizes maintains the full image without cropping." },
    ],
  },
  {
    id: "color-palette-generator",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes and export as CSS or Tailwind config.",
    tag: "Popular",
    category: "utility",
    iconName: "Droplets",
    keywords: ["color palette generator", "color scheme generator", "tailwind colors", "css color palette", "color harmony generator", "complementary colors", "color palette maker", "design color scheme", "brand colors generator", "color theory tool"],
    seoContent: {
      longDescription: "The ZamDev Color Palette Generator creates harmonious color schemes based on color theory principles. Start with any base color and generate complementary, analogous, triadic, split-complementary, or monochromatic palettes automatically. Preview palettes visually, explore variations, and export as CSS custom properties or Tailwind CSS configuration. Perfect for designers building brand identities, UI kits, and design systems.",
      howItWorks: [
        "Pick a base color using the color picker or enter a hex value.",
        "Select a color harmony type (complementary, analogous, triadic, etc.).",
        "The tool generates a harmonious palette based on color theory.",
        "Explore generated colors and their HEX/RGB/HSL values.",
        "Export the palette as CSS custom properties or Tailwind CSS config."
      ],
      useCases: [
        "Creating brand color palettes from a primary brand color",
        "Generating color scales for design system components",
        "Finding complementary colors for marketing materials",
        "Building Tailwind CSS theme configurations",
        "Exploring color harmonies for UI design projects",
        "Creating accessible color combinations for websites"
      ],
    },
    faqItems: [
      { q: "What color harmonies are supported?", a: "The generator supports complementary, analogous, triadic, split-complementary, and monochromatic color harmonies based on color theory principles." },
      { q: "Can I export for Tailwind CSS?", a: "Yes. You can export your generated palette as CSS custom properties or as a Tailwind CSS configuration object ready to paste into your tailwind.config.js." },
      { q: "What is a complementary color scheme?", a: "Complementary colors are opposite each other on the color wheel (like blue and orange). They create high contrast and visual energy, making them great for calls-to-action and accent colors." },
      { q: "What is an analogous color scheme?", a: "Analogous colors are next to each other on the color wheel (like blue, blue-green, and green). They create harmonious, cohesive designs and are often found in nature." },
      { q: "How do I pick a good base color?", a: "Start with your brand's primary color or pick a color that evokes the right emotion: blue for trust, green for growth, red for energy, purple for creativity. The tool handles generating harmonious companions." },
      { q: "Can I check color contrast for accessibility?", a: "The palette display shows color values that you can test for WCAG contrast ratios. For best accessibility, ensure text colors have at least 4.5:1 contrast ratio against backgrounds." },
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
