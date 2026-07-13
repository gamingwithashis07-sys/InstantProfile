import { GlassCard } from '@/components/ui/GlassCard'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <GlassCard className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-[#f4a261]" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[#2d1f14] dark:text-[#e8d5c4]">
          <Section title="1. Introduction">
            InstantProfile (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Instagram automation platform, including DM campaigns, scheduled posts, auto-replies, hashtag management, analytics, link shortener, bio pages, and digital product sales (collectively, the &quot;Service&quot;).
          </Section>

          <Section title="2. Information We Collect">
            <h4 className="font-semibold mb-2">2.1 Personal Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, username, and profile information when you register via Clerk authentication.</li>
              <li><strong>Instagram Account Data:</strong> Instagram Business/Creator account ID, username, profile picture, follower count, and media insights obtained through the Meta Graph API OAuth flow.</li>
              <li><strong>Payment Information:</strong> Payment details are processed by Razorpay. We do not store credit/debit card numbers. We store transaction IDs, order amounts, and payment statuses.</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Log Data:</strong> IP address, browser type, device information, pages visited, time and date of access, and referring URLs.</li>
              <li><strong>Cookies:</strong> We use essential cookies for authentication (Clerk) and functionality. We do not use tracking cookies for advertising.</li>
              <li><strong>Security Logs:</strong> Failed authentication attempts, unauthorized access attempts, and API request metadata for security auditing.</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">2.3 Automation Data</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>DM Campaigns:</strong> Message templates, recipient usernames, campaign triggers, and delivery status.</li>
              <li><strong>Scheduled Posts:</strong> Captions, media URLs, and scheduling timestamps.</li>
              <li><strong>Auto-Replies:</strong> Trigger keywords, reply templates, and usage statistics.</li>
              <li><strong>Short Links:</strong> Target URLs and click analytics.</li>
              <li><strong>Bio Pages:</strong> Page content, links, and theme preferences.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide, maintain, and improve the Service (DM automation, content scheduling, analytics).</li>
              <li>To process transactions via Razorpay and manage digital product sales.</li>
              <li>To monitor usage trends and prevent abuse of the platform.</li>
              <li>To enforce DM rate limits and fair usage policies based on your subscription plan.</li>
              <li>To generate security audit logs for detecting unauthorized access.</li>
              <li>To communicate with you about service updates, billing, and support.</li>
            </ul>
          </Section>

          <Section title="4. Legal Basis for Processing (GDPR)">
            If you are in the European Economic Area (EEA), our legal basis for processing your information includes:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Consent:</strong> You have given consent for specific processing purposes.</li>
              <li><strong>Contract:</strong> Processing is necessary for the performance of our Service agreement.</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests (security, analytics, fraud prevention).</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing and Disclosure">
            <p className="mb-2">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Meta (Facebook):</strong> Instagram account data is accessed via Meta Graph API with your explicit OAuth consent. We share only what is necessary for automation features.</li>
              <li><strong>Razorpay:</strong> Payment processing — we share order amounts and customer details necessary for billing.</li>
              <li><strong>Clerk:</strong> Authentication provider — they handle login credentials and session management.</li>
              <li><strong>Prisma Accelerate:</strong> Database hosting — your data is stored on Prisma&apos;s managed PostgreSQL infrastructure.</li>
              <li><strong>Vercel:</strong> Application hosting — your data passes through Vercel&apos;s edge network for content delivery.</li>
              <li><strong>Legal Compliance:</strong> We may disclose information if required by law or to protect our rights.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account data:</strong> Retained until you delete your account or request removal.</li>
              <li><strong>Automation logs:</strong> DM campaigns, queue items, and auto-reply logs are retained for 12 months, then anonymized.</li>
              <li><strong>Security audit logs:</strong> Retained for 6 months for security analysis.</li>
              <li><strong>Transaction records:</strong> Retained for 7 years as required by tax regulations.</li>
              <li><strong>Session data:</strong> Managed by Clerk and expires according to their session policy.</li>
            </ul>
          </Section>

          <Section title="7. Instagram Data and API Compliance">
            <p className="mb-2">Our Service operates under Meta&apos;s Platform Terms and Instagram Graph API policies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We only access data you explicitly authorize via Facebook Login (OAuth 2.0).</li>
              <li>We do not store Instagram passwords or session cookies.</li>
              <li>Access tokens are encrypted and stored with expiration handling.</li>
              <li>Automation features comply with Meta&apos;s acceptable use policy — no fake engagement, no spam, no prohibited content.</li>
              <li>You may revoke our app&apos;s access at any time via Facebook Settings &gt; Apps &amp; Websites.</li>
              <li>We cache analytics data (follower counts, engagement metrics) for up to 24 hours to reduce API calls.</li>
            </ul>
          </Section>

          <Section title="8. DM and Communication Data">
            <p className="mb-2">Our DM automation features involve processing Instagram messages:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Message templates you create are stored to execute automated campaigns.</li>
              <li>Recipient usernames are stored for campaign targeting and queue management.</li>
              <li>We do not read or store the content of incoming DMs beyond what is necessary for auto-reply triggers.</li>
              <li>Conversation metadata (participant, last message preview) is stored for inbox display.</li>
              <li>All DM sending respects Instagram&apos;s rate limits and your plan&apos;s monthly cap.</li>
            </ul>
          </Section>

          <Section title="9. Digital Products and Payments">
            <p className="mb-2">For users who sell digital products through our platform:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product files are stored as base64 data within our database.</li>
              <li>Payment processing is handled entirely by Razorpay — we never see your payment credentials.</li>
              <li>Creator balances and transaction histories are stored for accounting purposes.</li>
              <li>Buyer information (email, order details) is shared with the product creator for delivery.</li>
            </ul>
          </Section>

          <Section title="10. Your Rights">
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements).</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (does not affect lawfulness of prior processing).</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at <strong>support@instantprofile.app</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="11. Security Measures">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Encryption:</strong> All data transmitted over HTTPS/TLS 1.3. Access tokens encrypted at rest.</li>
              <li><strong>Authentication:</strong> Multi-factor authentication available via Clerk.</li>
              <li><strong>Authorization:</strong> Role-based access control — admin and user roles are strictly separated.</li>
              <li><strong>Audit Logging:</strong> All security events (unauthorized access attempts, permission violations) are logged with IP, device, and timestamps.</li>
              <li><strong>Rate Limiting:</strong> API endpoints are rate-limited to prevent abuse.</li>
              <li><strong>Infrastructure:</strong> Hosted on Vercel&apos;s SOC 2 compliant infrastructure with Prisma Accelerate&apos;s managed database.</li>
            </ul>
          </Section>

          <Section title="12. Children&apos;s Privacy">
            Our Service is not intended for individuals under 13 years of age (or 16 in the EEA). We do not knowingly collect data from children. If you believe a child has provided us with personal data, contact us immediately.
          </Section>

          <Section title="13. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify users of material changes via email or through the dashboard. Continued use of the Service after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="14. Contact Information">
            <p>For privacy-related inquiries:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Email:</strong> support@instantprofile.app</li>
              <li><strong>Data Protection Officer:</strong> dpo@instantprofile.app</li>
              <li><strong>Response Time:</strong> We aim to respond within 48 hours, and resolve within 30 days.</li>
            </ul>
          </Section>
        </div>
      </GlassCard>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-[#f4a261]">{title}</h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
