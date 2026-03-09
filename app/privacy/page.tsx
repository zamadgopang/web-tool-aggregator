import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/tools-data"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}. Learn how we protect your data — all tools run 100% client-side in your browser.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-8"
        >
          &larr; Back to Tools
        </Link>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: March 9, 2026
          </p>

          <hr className="my-8 border-border" />

          <h2>Overview</h2>
          <p>
            At <strong>Tools by ZamDev</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our website at{" "}
            <a href={siteConfig.url} className="text-primary hover:underline">
              {siteConfig.url}
            </a>.
          </p>

          <h2>Client-Side Processing</h2>
          <p>
            The vast majority of our tools process data <strong>entirely in your browser</strong>. This means:
          </p>
          <ul>
            <li>Your files, text, and data <strong>never leave your device</strong></li>
            <li>No data is uploaded to our servers for processing</li>
            <li>No user data is stored in our databases</li>
            <li>You maintain full control of your information at all times</li>
          </ul>

          <h2>Server-Side Tools</h2>
          <p>
            Certain tools (such as the SEO & Performance Auditor) require server-side processing to function. These tools:
          </p>
          <ul>
            <li>Only process the specific URL or data you provide</li>
            <li>Do not store any results or submitted data after the request is complete</li>
            <li>May call third-party APIs (e.g., Google PageSpeed Insights) to generate reports</li>
          </ul>

          <h2>Information We Collect</h2>
          <h3>Analytics</h3>
          <p>
            We use <strong>Vercel Analytics</strong> to collect anonymous usage data such as page views, referral sources, and browser type. This data is aggregated and <strong>cannot be used to identify individual users</strong>. No personal information, IP addresses, or cookies are used for tracking.
          </p>

          <h3>No Account Required</h3>
          <p>
            We do not require you to create an account, sign in, or provide any personal information to use our tools. There is no registration, no email collection, and no user profiles.
          </p>

          <h2>Cookies</h2>
          <p>
            We use minimal cookies strictly for functionality:
          </p>
          <ul>
            <li><strong>Theme preference</strong> — stores your light/dark mode choice</li>
          </ul>
          <p>
            We do <strong>not</strong> use advertising cookies, tracking cookies, or third-party marketing cookies.
          </p>

          <h2>Third-Party Services</h2>
          <p>Our website may interact with the following third-party services:</p>
          <ul>
            <li><strong>Vercel</strong> — hosting and analytics</li>
            <li><strong>Google PageSpeed Insights API</strong> — used by the SEO Auditor tool (Google&apos;s privacy policy applies)</li>
            <li><strong>Google Fonts</strong> — for typography (loaded via DNS prefetch)</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            Our website is served over <strong>HTTPS</strong> with security headers including Content Security Policy, X-Frame-Options, and Strict Transport Security. We follow industry best practices to ensure your browsing experience is secure.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our services are not directed at children under 13. We do not knowingly collect any information from children.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through{" "}
            <a href="https://zamdev.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              zamdev.me
            </a>.
          </p>
        </article>
      </div>
    </div>
  )
}
