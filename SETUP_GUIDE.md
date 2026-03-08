# Setup & Deployment Guide

Complete instructions for setting up, developing, and deploying the ToolKit application.

## 📋 Prerequisites

- **Node.js**: 18.17.0 or higher
- **npm**: 9+ or **pnpm**: 8+ (recommended)
- **Git**: For version control
- **Code Editor**: VS Code recommended

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/zamadgopang/web-tool-aggregator.git
cd web-tool-aggregator
```

### 2. Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code with Prettier (if configured)
pnpm format
```

### Project Structure

```
web-tool-aggregator/
├── app/                      # Next.js App Router
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── tools/                # Tool implementations
│   ├── ui/                   # Shadcn UI components
│   ├── category-filter.tsx
│   ├── command-search.tsx
│   ├── header.tsx
│   ├── hero.tsx
│   ├── tool-card.tsx
│   ├── tool-grid.tsx
│   ├── tool-mapper.tsx
│   └── theme-provider.tsx
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities
├── public/                   # Static files
├── styles/                   # Additional styles
├── components.json           # Shadcn config
├── next.config.mjs          # Next.js config
├── package.json
├── postcss.config.mjs       # PostCSS config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── TOOLS_DOCUMENTATION.md   # User guide
├── DEVELOPER_GUIDE.md       # Developer instructions
├── IMPROVEMENTS_SUMMARY.md  # Changes made
└── README.md                # Project overview
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory (optional):

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add any API keys or configuration here
```

### Tailwind CSS

Configuration in `tailwind.config.ts`:
- Custom color schemes
- Typography settings
- Component extensions
- Responsive breakpoints

### TypeScript

Configuration in `tsconfig.json`:
- Strict mode enabled
- Module resolution
- Type checking

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css` or modify Tailwind config in `tailwind.config.ts`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --primary: 0 0% 9%;
  /* More colors... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    /* Dark mode colors... */
  }
}
```

### Add New Icons

Import from lucide-react:

```tsx
import { IconName } from "lucide-react"

// Use in your component
<IconName className="h-6 w-6" />
```

### Modify Layout

Edit the responsive classes in components:

```tsx
// Example: 1 column on mobile, 2 on tablet, 3 on desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] All tools load without errors
- [ ] Tools function correctly
- [ ] Mobile view responsive
- [ ] Dark/light theme toggles
- [ ] Search functionality works
- [ ] File uploads parse correctly
- [ ] Copy buttons work
- [ ] Download features work
- [ ] Error messages display properly
- [ ] Keyboard navigation works

### Browser Testing

Test in multiple browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Performance Testing

Use Lighthouse in Chrome DevTools:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Vercel is the optimal platform for Next.js apps.

#### Method 1: GitHub Integration (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure settings (usually auto-detected)
6. Click "Deploy"
7. Custom domain (optional)

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
pnpm build

# Deploy
netlify deploy --prod --dir=.next
```

#### Docker (Any Host)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t web-tool-aggregator .
docker run -p 3000:3000 web-tool-aggregator
```

#### AWS, Google Cloud, Azure

Most support Node.js applications:

1. Build: `pnpm build`
2. Run: `npm start`
3. Port: 3000 (default)

### Environment Variables for Production

Set these in your deployment platform:

```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 📈 Performance Optimization

### Before Deployment

1. **Code Splitting**: Already configured
2. **Image Optimization**: Using Next.js Image component
3. **CSS Minification**: Tailwind handles this
4. **JavaScript Minification**: Next.js build process
5. **Route Prefetching**: Built into Next.js

### Check Build Size

```bash
pnpm build
# Check the output for bundle analysis
```

### Optimization Tips

- Lazy load heavy components
- Use React.memo for expensive components
- Optimize database queries (if you add a backend)
- Cache static assets
- Use CDN for media files

## 🔒 Security

### Production Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) set
- [ ] No sensitive data in client code
- [ ] Dependencies up to date
- [ ] No hardcoded API keys
- [ ] Error pages don't leak info
- [ ] Rate limiting if needed

### Update Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update all packages
pnpm upgrade

# Update to latest versions
pnpm upgrade --latest
```

## 📊 Monitoring

### Recommended Tools

1. **Sentry** - Error tracking
2. **LogRocket** - Session replay
3. **Google Analytics** - User analytics (privacy mode)
4. **Vercel Analytics** - Performance metrics

### Setup Monitoring

```bash
# Example: Sentry setup
npm install @sentry/nextjs

# Configure in next.config.js
```

## 🚨 Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# Use different port
pnpm dev -p 3001
```

#### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

#### TypeScript Errors
```bash
# Check TypeScript
pnpm tsc --noEmit
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=* pnpm dev
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📞 Support

- Create a GitHub issue for bugs
- Discussion forum for questions
- Email for business inquiries

## 📄 License

This project is open source under the MIT License.

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Check code quality |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests (if configured) |

## Version History

- **v1.0.0** (March 9, 2026) - Initial release with 10+ tools

---

**Last Updated**: March 9, 2026
