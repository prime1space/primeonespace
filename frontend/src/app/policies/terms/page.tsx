import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-20 bg-zinc-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 hover:bg-zinc-100">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shadow-sm">
            <FileText className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">Terms of Service</h1>
            <p className="text-zinc-500 mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="pt-8 px-6 md:px-10 prose prose-zinc max-w-none text-justify prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-600 prose-p:leading-8 prose-p:mb-6 prose-li:text-zinc-600 prose-li:leading-8 prose-li:mb-3">
            <h2 className="text-zinc-900">1. About This Website</h2>
            <p>
              This website ("Website") is owned and operated by Prime One Global (Pvt) Ltd ("Prime One Global," "we," "our," or "us").
            </p>
            <p>
              By accessing or using this Website, you agree to comply with these Terms of Use and our Privacy Notice. If you do not agree, you must discontinue use of this Website.
            </p>

            <h2 className="text-zinc-900">2. Website Content & Ownership</h2>
            <p>
              All content available on this Website—including text, graphics, images, logos, designs, documents, and software—is owned by Prime One Global or licensed to us, unless otherwise stated.
            </p>
            <p>
              You may view, download, and print content solely for personal and informational purposes. You may not copy, modify, distribute, publish, sell, license, or exploit any Website content without prior written permission from Prime One Global.
            </p>

            <h2 className="text-zinc-900">3. Trademarks</h2>
            <p>
              All trademarks, logos, service marks, and brand elements displayed on this Website are the exclusive property of Prime One Global unless otherwise indicated.
            </p>
            <p>
              The use of any Prime One Global trademark without prior written consent is strictly prohibited. Third-party trademarks remain the property of their respective owners and do not imply endorsement or affiliation.
            </p>

            <h2 className="text-zinc-900">4. Acceptable Use of the Website</h2>
            <p>You agree to use this Website only for lawful purposes. You must not:</p>
            <ul>
              <li>Post or transmit unlawful, defamatory, abusive, obscene, or harmful content</li>
              <li>Attempt to gain unauthorized access to the Website or related systems</li>
              <li>Introduce viruses, malware, or other malicious code</li>
              <li>Interfere with the security, availability, or functionality of the Website</li>
              <li>Misrepresent your identity or submit false information</li>
            </ul>
            <p>
              We reserve the right to restrict or terminate access if misuse is detected.
            </p>

            <h2 className="text-zinc-900">5. Linking, Framing & Automated Access</h2>
            <ul>
              <li>You may link to our homepage in a fair and lawful manner that does not damage our reputation or imply endorsement.</li>
              <li>Framing the Website, using hidden text, or misusing metadata related to Prime One Global trademarks is prohibited.</li>
              <li>Automated data extraction tools (bots, spiders, scrapers) are not permitted without written authorization.</li>
            </ul>
            <p>
              Requests for permission may be sent to: <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a>
            </p>

            <h2 className="text-zinc-900">6. Information We Collect</h2>
            <p>The information we collect depends on how you interact with the Website and may include:</p>
            <h3 className="text-zinc-800">6.1 Personal Information</h3>
            <p>
              Name, email address, phone number, company name, or other details you voluntarily submit through forms or inquiries.
            </p>
            <h3 className="text-zinc-800">6.2 Technical & Usage Information</h3>
            <p>
              IP address, browser type, device type, operating system, pages visited, timestamps, and similar analytics data collected via cookies or tracking technologies.
            </p>

            <h2 className="text-zinc-900">7. How We Use Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to inquiries and provide requested information</li>
              <li>Improve Website performance and user experience</li>
              <li>Communicate updates, services, or relevant information</li>
              <li>Maintain Website security and prevent misuse</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>

            <h2 className="text-zinc-900">8. Cookies & Tracking Technologies</h2>
            <p>We use cookies and similar technologies to operate and improve the Website.</p>
            <p><strong>Types of Cookies Used:</strong></p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for core Website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand Website usage and performance</li>
              <li><strong>Functionality Cookies:</strong> Remember user preferences</li>
              <li><strong>Marketing Cookies:</strong> Used where applicable for communications and promotions</li>
            </ul>
            <p>
              You may manage or disable cookies via your browser settings. Disabling cookies may affect Website functionality.
            </p>

            <h2 className="text-zinc-900">9. Marketing Communications & Opt-Out</h2>
            <p>
              If you choose to subscribe to communications, you may receive newsletters or promotional messages.
            </p>
            <p>You may opt out at any time by:</p>
            <ul>
              <li>Using the unsubscribe link in emails, or</li>
              <li>Contacting us at <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a></li>
            </ul>
            <p>
              Service-related communications may still be sent when necessary.
            </p>

            <h2 className="text-zinc-900">10. Data Retention</h2>
            <p>
              We retain personal information only for as long as necessary to fulfil the purpose for which it was collected or to comply with legal requirements. Data that is no longer required is securely deleted or anonymized.
            </p>

            <h2 className="text-zinc-900">11. Data Protection & Security</h2>
            <p>
              Prime One Global implements reasonable technical and organizational safeguards to protect personal information, including access controls and security monitoring.
            </p>
            <p>
              However, no website or system can be guaranteed to be completely secure. Use of this Website is at your own risk.
            </p>

            <h2 className="text-zinc-900">12. Third-Party Links</h2>
            <p>
              This Website may contain links to third-party websites for convenience or information. Prime One Global is not responsible for the content, policies, or practices of third-party sites. Accessing such sites is at your own risk.
            </p>

            <h2 className="text-zinc-900">13. Disclaimer of Warranties</h2>
            <p>
              This Website and its content are provided "as is" and "as available."
            </p>
            <p>
              Prime One Global makes no warranties, express or implied, regarding accuracy, completeness, reliability, or availability of the Website.
            </p>

            <h2 className="text-zinc-900">14. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Prime One Global shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of, or inability to use, this Website.
            </p>

            <h2 className="text-zinc-900">15. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Prime One Global from any claims, damages, or expenses arising from your misuse of the Website or violation of these Terms.
            </p>

            <h2 className="text-zinc-900">16. Governing Law</h2>
            <p>
              These Terms of Use are governed by and construed in accordance with the laws of Sri Lanka.
            </p>

            <h2 className="text-zinc-900">17. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. Changes become effective upon publication on the Website. Continued use of the Website constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-zinc-900">18. Contact Us</h2>
            <p>
              For questions or concerns regarding these Terms or our privacy practices:
            </p>
            <p>
              📧 <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a><br />
              🏢 Prime One Global (Pvt) Ltd<br />
              Address: 146B, Goodshed Road,<br />Thonikkal, Vavuniya, NP, Sri Lanka.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 flex-wrap justify-center md:justify-start">
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/privacy">Privacy Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/cancellation">Cancellation Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/refund">Refund Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/it-policy">IT Access Policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
