import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">Privacy Policy</h1>
            <p className="text-zinc-500 mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="pt-8 px-6 md:px-10 prose prose-zinc max-w-none text-justify prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-zinc-600 prose-li:text-zinc-600 prose-h2:mt-12 prose-h2:mb-6 prose-p:leading-8 prose-p:mb-6 prose-li:leading-8 prose-li:mb-3">
            <h2 className="text-zinc-900">1. Information We Collect</h2>
            <p>
              <strong className="text-zinc-900">1.1 Personal Information</strong><br />
              When you register for membership or book our services, we collect:
            </p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and payment information</li>
              <li>Business or professional details</li>
              <li>Profile photograph (optional)</li>
            </ul>
            <p>
              <strong className="text-zinc-900">1.2 Usage Information</strong><br />
              We automatically collect information about your use of our services, including:
            </p>
            <ul>
              <li>Booking history and preferences</li>
              <li>Access logs and facility usage</li>
              <li>Website and app usage data</li>
              <li>Device and browser information</li>
            </ul>

            <h2 className="text-zinc-900">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and manage your membership and bookings</li>
              <li>Process payments and maintain billing records</li>
              <li>Communicate with you about services, events, and updates</li>
              <li>Improve our facilities and services</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-zinc-900">3. Information Sharing</h2>
            <p>
              <strong className="text-zinc-900">3.1 We Do Not Sell Your Data</strong><br />
              We do not sell, trade, or rent your personal information to third parties.
            </p>
            <p>
              <strong className="text-zinc-900">3.2 Service Providers</strong><br />
              We may share information with trusted service providers who assist us in operating our business, including:
            </p>
            <ul>
              <li>Payment processors</li>
              <li>Email and communication services</li>
              <li>Cloud storage and hosting providers</li>
              <li>Security and access control systems</li>
            </ul>
            <p>
              <strong className="text-zinc-900">3.3 Legal Requirements</strong><br />
              We may disclose information when required by law or to protect our rights and safety.
            </p>

            <h2 className="text-zinc-900">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul>
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-zinc-900">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong className="text-zinc-900">Access:</strong> Request copies of your personal data</li>
              <li><strong className="text-zinc-900">Correction:</strong> Request correction of inaccurate information</li>
              <li><strong className="text-zinc-900">Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong className="text-zinc-900">Portability:</strong> Receive your data in a structured format</li>
              <li><strong className="text-zinc-900">Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a>
            </p>

            <h2 className="text-zinc-900">6. Cookies and Tracking</h2>
            <p>
              Our website uses cookies to enhance your experience. Cookies are small files stored on your device that help us:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve website performance</li>
            </ul>
            <p>
              You can control cookies through your browser settings.
            </p>

            <h2 className="text-zinc-900">7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children.
            </p>

            <h2 className="text-zinc-900">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than Sri Lanka. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-zinc-900">9. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide services and comply with legal obligations. After account termination, we may retain certain information for legitimate business purposes and legal requirements.
            </p>

            <h2 className="text-zinc-900">10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice. Your continued use of services constitutes acceptance of updated policies.
            </p>

            <h2 className="text-zinc-900">11. Contact Us</h2>
            <p>
              For privacy-related questions or concerns:<br />
              Email: <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a><br />
              Phone: 077 222 8507<br />
              Address: 146B, Goodshed Road,<br />Thonikkal, Vavuniya, NP, Sri Lanka.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 flex-wrap justify-center md:justify-start">
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/terms">Terms of Service</Link>
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
