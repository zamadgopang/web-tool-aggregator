# ToolKit - Web-Based Tools Aggregator

A modern, premium, and high-performance web application featuring a collection of client-side tools for image conversion, data transformation, security utilities, and more.

## Features

✨ **Premium Experience**
- Modern, clean UI with dark/light theme support
- Smooth animations and transitions
- Professional color schemes and typography
- Responsive design for all devices

🚀 **High Performance**
- 100% client-side processing - no server uploads
- Instant tool execution with zero latency
- Optimized for fast loading and responsiveness
- Progressive enhancement for offline functionality

🔒 **Privacy First**
- Your files never leave your browser
- No data collection or analytics tracking
- All processing happens locally on your device
- Open source and transparent

♿ **Accessibility**
- WCAG 2.1 compliant
- Keyboard navigation support
- Semantic HTML and ARIA labels
- High contrast mode support
- Screen reader optimized

📱 **Mobile Responsive**
- Fully responsive design
- Touch-friendly interface
- Optimized for all screen sizes
- Progressive Web App ready

## Available Tools

### Image Tools
- **Image Converter** - Convert images to JPG, PNG, WebP, BMP, GIF with compression options
- **SVG to PNG** - Convert vector SVG to raster PNG with custom scaling

### Security & Encoding
- **Base64 Converter** - Encode/decode text and files to Base64
- **Password Generator** - Generate secure random passwords with custom requirements
- **Hash Generator** - Generate MD5, SHA1, SHA256, SHA512 hashes
- **QR Code Generator** - Create QR codes with adjustable size and error correction

### Utility Tools
- **Color Converter** - Convert between HEX, RGB, and HSL color formats
- **Unit Converter** - Convert length, weight, temperature, volume, and speed
- **Text Minifier** - Minify HTML, CSS, and JavaScript code
- **JSON Formatter** - Format, validate, and minify JSON with syntax highlighting

### Document Tools
- **Merge PDFs** - Combine multiple PDF files *(Coming Soon)*
- **Compress PDF** - Reduce PDF file size *(Coming Soon)*
- **DOCX to PDF** - Convert Word documents to PDF *(Coming Soon)*
- **CSV to Excel** - Convert CSV files to Excel format *(Coming Soon)*

### Media Tools
- **Video to GIF** - Convert video files to animated GIFs *(Coming Soon)*

## Built With

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality UI components
- **Lucide Icons** - Beautiful icon library
- **Radix UI** - Unstyled accessible components

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Main home page with tool grid
├── components/
│   ├── tools/           # Individual tool implementations
│   │   ├── image-converter.tsx
│   │   ├── base64-converter.tsx
│   │   ├── password-generator.tsx
│   │   ├── hash-generator.tsx
│   │   ├── color-converter.tsx
│   │   ├── json-formatter.tsx
│   │   ├── qr-code-generator.tsx
│   │   ├── unit-converter.tsx
│   │   ├── text-minifier.tsx
│   │   └── svg-to-png.tsx
│   ├── ui/              # Reusable UI components
│   ├── category-filter.tsx    # Tool category filter
│   ├── command-search.tsx     # CMD+K search dialog
│   ├── header.tsx             # Header with theme toggle
│   ├── hero.tsx               # Landing section
│   ├── tool-card.tsx          # Individual tool card
│   ├── tool-grid.tsx          # Tool grid display
│   ├── tool-mapper.tsx        # Tool routing
│   └── theme-provider.tsx     # Dark mode provider
├── hooks/
│   ├── use-mobile.ts    # Mobile detection hook
│   └── use-toast.ts     # Toast notification hook
├── lib/
│   └── utils.ts         # Utility functions
├── public/              # Static assets
├── styles/              # Global styles
├── components.json      # Shadcn component config
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-tool-aggregator

# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Usage

### Navigating Tools
1. **Browse**: Scroll through the main page and click on any tool card
2. **Filter**: Use category filters to find tools by type
3. **Search**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open search
4. **Back**: Click the "Back to Tools" button to return to the main view

### Tool Features

#### Image Converter
- Supports JPG, PNG, WebP, BMP, GIF formats
- Adjust compression quality (1-100%)
- Drag & drop file upload
- Real-time file size comparison

#### Password Generator
- Customize character types (uppercase, lowercase, numbers, symbols)
- Adjustable length (8-64 characters)
- Real-time strength indicator
- Copy to clipboard with one click

#### Hash Generator
- Supports MD5, SHA1, SHA256, SHA512
- Works with large text inputs
- Copy individual hashes to clipboard

#### Color Converter
- Convert between HEX, RGB, and HSL
- Color preview
- Suggested color variations
- Keyboard accessible color picker

#### JSON Formatter
- Format with custom indentation
- Minify to remove whitespace
- Validate JSON syntax
- File size comparison

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization and lazy loading
- CSS minification and purging
- Efficient state management
- Browser caching with service workers

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus management and visible focus indicators
- ✅ Color contrast ratios (WCAG AAA)
- ✅ Form labels and field descriptions
- ✅ Error messages and validation feedback
- ✅ Screen reader support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Planned Features

- PDF manipulation tools (merge, compress, split)
- Video to GIF converter with FFmpeg support
- Document format conversions
- More encryption/security tools
- Batch file processing
- Tool history and favorites
- Offline mode with service worker
- Progressive Web App (PWA) features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Privacy Policy

All processing happens entirely in your browser. No data is sent to servers. No tracking, no cookies, no analytics.

## Support

For issues and feature requests, please open an issue on GitHub.

---

**ToolKit** - Free, Fast, Secure Browser Tools. Your data, your privacy, your control.
