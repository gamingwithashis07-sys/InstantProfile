import { GlassCard } from '@/components/ui/GlassCard'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <GlassCard className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-[#f4a261]" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[#2d1f14] dark:text-[#e8d5c4]">
          <Section title="1. Acceptance of Terms">
            By accessing or using InstantProfile (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
          </Section>

          <Section title="2. Service Description">
            InstantProfile provides Instagram automation tools including DM campaigns, content scheduling, auto-replies, hashtag management, analytics, link shortener, bio pages, and digital product marketplace. All Instagram-related features use the official Meta Graph API.
          </Section>

          <Section title="3. Eligibility">
            You must be at least 13 years old (16 in the EEA) and have a valid Instagram Business or Creator account. You must have the legal authority to bind your organization if using on behalf of an entity.
          </Section>

          <Section title="4. Account Registration">
            Accounts are managed through Clerk authentication. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately of unauthorized use.
          </Section>

          <Section title="5. Instagram Compliance">
            <p className="mb-2">By connecting an Instagram account, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Comply with Meta&apos;s Platform Terms, Instagram Community Guidelines, and Graph API policies.</li>
              <li>Only automate accounts you own or have explicit authorization to manage.</li>
              <li>Not use the Service for spam, harassment, misleading content, or prohibited commercial activities.</li>
              <li>Not exceed Instagram&apos;s rate limits or use the Service to bypass Instagram&apos;s native restrictions.</li>
              <li>Maintain a Business or Creator Instagram account type (Personal accounts are not supported).</li>
            </ul>
          </Section>

          <Section title="6. Fair Usage and Rate Limits">
            <p className="mb-2">Usage is subject to your subscription plan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Starter Plan:</strong> 1,000 DMs per month hard limit, basic keyword triggers only.</li>
              <li><strong>Pro Plan:</strong> Soft cap of 20,000 DMs per month under fair-use policy. Excessive usage may result in throttling.</li>
              <li>We reserve the right to adjust rate limits to maintain platform stability.</li>
              <li>DM limits reset on the first day of each billing month.</li>
            </ul>
          </Section>

          <Section title="7. Digital Products">
            <ul className="list-disc pl-5 space-y-1">
              <li>Creators are responsible for the legality and accuracy of their products.</li>
              <li>All products must include valid Privacy Policy, Refund Policy, and Terms of Service.</li>
              <li>InstantProfile acts as a platform provider and is not responsible for creator content.</li>
              <li>Payments are processed via Razorpay. Refund disputes are between buyer and seller.</li>
              <li>We reserve the right to remove products that violate policies.</li>
            </ul>
          </Section>

          <Section title="8. Prohibited Activities">
            <ul className="list-disc pl-5 space-y-1">
              <li>Reverse engineering, scraping, or attempting to bypass security measures.</li>
              <li>Using the platform to distribute malware, phishing links, or harmful content.</li>
              <li>Creating multiple accounts to circumvent plan limits or bans.</li>
              <li>Automating engagement (likes, follows, comments) in a way that violates Instagram policies.</li>
              <li>Uploading copyrighted material without authorization.</li>
            </ul>
          </Section>

          <Section title="9. Termination">
            We may suspend or terminate accounts for violations of these terms. You may delete your account at any time via dashboard settings. Upon termination, your data will be deleted per our Privacy Policy retention schedule.
          </Section>

          <Section title="10. Limitation of Liability">
            InstantProfile is provided &quot;as is&quot; without warranties. We are not liable for damages arising from use of the Service, including but not limited to Instagram account actions (suspension, content removal) resulting from automation features.
          </Section>

          <Section title="11. Changes to Terms">
            We may modify these terms with 30 days&apos; notice via email or dashboard notification. Continued use after changes constitutes acceptance.
          </Section>

          <Section title="12. Contact">
            For questions about these terms: <strong>support@instantprofile.app</strong>
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
