import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/tools-data"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}. Free browser-based developer and design tools.`,
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
}

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: March 9, 2026
          </p>

          <hr className="my-8 border-border" />

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using <strong>Tools by ZamDev</strong> (&quot;the Service&quot;) at{" "}
            <a href={siteConfig.url} className="text-primary hover:underline">
              {siteConfig.url}
            </a>, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Tools by ZamDev provides a collection of free, browser-based developer and design tools. Most tools operate entirely client-side in your web browser. Some tools (such as the SEO & Performance Auditor) use server-side APIs to provide their functionality.
          </p>

          <h2>3. Free to Use</h2>
          <p>
            All tools are provided <strong>free of charge</strong>. We reserve the right to add, modify, or remove tools at any time without prior notice.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the tools for lawful purposes only</li>
            <li>Not attempt to abuse, exploit, or overload our services</li>
            <li>Not use automated systems to scrape or excessively call our APIs</li>
            <li>Take responsibility for the data you process through our tools</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The website design, code, and branding of Tools by ZamDev are the property of ZamDev. The tools themselves are open source — please refer to the project&apos;s repository for licensing details.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> without warranties of any kind, either express or implied. We do not guarantee that:
          </p>
          <ul>
            <li>The tools will be error-free or uninterrupted</li>
            <li>Results produced by the tools will be accurate or complete</li>
            <li>The Service will meet your specific requirements</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ZamDev shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of data, profits, or business opportunities.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            Certain tools may rely on third-party APIs (e.g., Google PageSpeed Insights). These services are governed by their own terms and privacy policies. We are not responsible for the availability or accuracy of third-party services.
          </p>

          <h2>9. Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>. Please review it to understand how we handle your information.
          </p>

          <h2>10. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service constitutes acceptance of the modified Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, please contact us through{" "}
            <a href="https://zamdev.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              zamdev.me
            </a>.
          </p>
        </article>
      </div>
    </div>
  )
}
