import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wifi, ArrowLeft } from "lucide-react";

export default function ITPolicyPage() {
    return (
        <div className="pt-32 pb-20 bg-zinc-50/50 min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button asChild variant="ghost" className="mb-6 hover:bg-zinc-100">
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <Wifi className="w-8 h-8 text-zinc-900" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">IT & Internet Policy</h1>
                        <p className="text-zinc-500 mt-1">Last updated: February 2026</p>
                    </div>
                </div>

                <Card className="border-zinc-200 shadow-sm">
                    <CardContent className="pt-8 px-6 md:px-10 prose prose-zinc max-w-none text-justify prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-600 prose-p:leading-8 prose-p:mb-6 prose-li:text-zinc-600 prose-li:leading-8 prose-li:mb-3">
                        <h2 className="text-zinc-900">1. Purpose</h2>
                        <p>
                            Prime One Global (Pvt) Ltd ("Prime One Global," "we," "our," or "us") provides Community workspace facilities that include shared IT infrastructure and Internet access for members, tenants, visitors, and other authorized users ("Users").
                        </p>
                        <p>
                            This policy explains how our IT and Internet services may be used, the limitations of those services, and the responsibilities of Users while accessing connectivity within Prime One Global Community workspaces.
                        </p>
                        <p>
                            By using our IT or Internet services, you agree to comply with this policy.
                        </p>

                        <h2 className="text-zinc-900">2. Scope & Applicability</h2>
                        <p>This Policy applies to:</p>
                        <ul>
                            <li>All members, tenants, clients, visitors, guests, and other authorized users</li>
                            <li>All personal or business devices used to access Prime One Global Internet or IT services</li>
                            <li>All access methods, including wired connections, Wi-Fi, and any other connectivity services provided</li>
                            <li>All Prime One Global Community workspace locations, meeting rooms, shared spaces, and common areas</li>
                        </ul>
                        <p>
                            This Policy applies whether services are provided free of charge or as part of a paid membership or service plan.
                        </p>

                        <h2 className="text-zinc-900">3. IT & Internet Services Provided</h2>
                        <p>Depending on your membership or service plan, Prime One Global may provide:</p>
                        <ul>
                            <li>Shared wired and/or wireless Internet access</li>
                            <li>Access to network infrastructure within Community workspace premises</li>
                            <li>Basic security controls such as firewalls and traffic filtering</li>
                            <li>Limited connectivity support related to access availability</li>
                        </ul>
                        <p>
                            Service levels, speeds, and performance may vary based on demand, capacity, and selected plans.
                        </p>

                        <h2 className="text-zinc-900">4. Service Availability & Limitations</h2>
                        <ul>
                            <li>IT and Internet services are provided on an "as is" and "as available" basis.</li>
                            <li>We do not guarantee uninterrupted service, minimum speeds, or uptime.</li>
                            <li>Temporary interruptions may occur due to:
                                <ul>
                                    <li>Maintenance or upgrades</li>
                                    <li>Power or ISP outages</li>
                                    <li>Network congestion</li>
                                    <li>Security events or force majeure</li>
                                </ul>
                            </li>
                        </ul>
                        <p>
                            Prime One Global is not responsible for losses caused by service interruptions beyond reasonable control.
                        </p>

                        <h2 className="text-zinc-900">5. Acceptable Use</h2>
                        <p>
                            Users agree to use Prime One Global IT and Internet services lawfully, responsibly, and respectfully, ensuring fair access for all users.
                        </p>
                        <p><strong className="text-zinc-900">Permitted Use</strong></p>
                        <ul>
                            <li>General business and professional activities</li>
                            <li>Meetings, video calls, cloud services, and collaboration tools</li>
                            <li>Activities consistent with the selected service or membership plan</li>
                        </ul>
                        <p><strong className="text-zinc-900">Prohibited Use</strong></p>
                        <p>Users must not use the services to:</p>
                        <ul>
                            <li>Violate any law or regulation of Sri Lanka</li>
                            <li>Access, transmit, or store illegal, offensive, abusive, or obscene content</li>
                            <li>Infringe intellectual property or proprietary rights</li>
                            <li>Introduce malware, viruses, ransomware, or harmful software</li>
                            <li>Attempt hacking, scanning, sniffing, or network attacks</li>
                            <li>Bypass security controls or monitoring mechanisms</li>
                            <li>Resell, redistribute, or share Internet access without authorization</li>
                            <li>Engage in activities that degrade service quality for other users</li>
                        </ul>
                        <p>
                            Prime One Global reserves the right to restrict or terminate access in cases of misuse.
                        </p>

                        <h2 className="text-zinc-900">6. Bandwidth & Fair Use</h2>
                        <ul>
                            <li>Internet usage is subject to fair-use controls to ensure equitable access.</li>
                            <li>Excessive or abnormal usage that impacts others may be throttled or restricted.</li>
                            <li>Higher bandwidth limits or dedicated connectivity may be available as paid upgrades, subject to availability and agreement.</li>
                        </ul>

                        <h2 className="text-zinc-900">7. Devices & User Responsibility</h2>
                        <ul>
                            <li>Users are responsible for their own devices and configurations.</li>
                            <li>Devices must be kept reasonably secure and free from malware.</li>
                            <li>Prime One Global is not responsible for:
                                <ul>
                                    <li>Loss or damage to personal devices</li>
                                    <li>Data loss, compromise, or security incidents on user devices</li>
                                </ul>
                            </li>
                        </ul>

                        <h2 className="text-zinc-900">8. Security & Monitoring Notice</h2>
                        <ul>
                            <li>No shared network or Internet service is completely secure.</li>
                            <li>Users acknowledge that:
                                <ul>
                                    <li>Network traffic may be monitored or logged</li>
                                    <li>Monitoring is conducted to maintain security, stability, and legal compliance</li>
                                </ul>
                            </li>
                        </ul>
                        <p>
                            Monitoring is performed in a proportionate and lawful manner and is not intended to intrude on personal content unless required for security or legal reasons.
                        </p>

                        <h2 className="text-zinc-900">9. Data Protection & Privacy</h2>
                        <ul>
                            <li>Prime One Global handles any personal data related to IT services in accordance with the Sri Lanka Personal Data Protection Act No. 9 of 2022.</li>
                            <li>We do not actively inspect personal communications unless required for:
                                <ul>
                                    <li>Security incidents</li>
                                    <li>Abuse prevention</li>
                                    <li>Legal or regulatory obligations</li>
                                </ul>
                            </li>
                            <li>Users remain responsible for protecting their own confidential or sensitive information.</li>
                        </ul>

                        <h2 className="text-zinc-900">10. Third-Party Providers</h2>
                        <p>
                            Internet services may rely on third-party providers. Prime One Global is not responsible for failures or limitations originating from third-party networks beyond our reasonable control.
                        </p>

                        <h2 className="text-zinc-900">11. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by Sri Lankan law, Prime One Global shall not be liable for:
                        </p>
                        <ul>
                            <li>Loss of data</li>
                            <li>Business interruption</li>
                            <li>Financial or reputational loss</li>
                            <li>Indirect or consequential damages</li>
                        </ul>
                        <p>
                            arising from the use or inability to use IT or Internet services.
                        </p>

                        <h2 className="text-zinc-900">12. Policy Enforcement</h2>
                        <p>Prime One Global may, without notice:</p>
                        <ul>
                            <li>Restrict or suspend access</li>
                            <li>Terminate services without refund</li>
                            <li>Deny future access</li>
                            <li>Report unlawful activity to relevant authorities</li>
                        </ul>

                        <h2 className="text-zinc-900">13. Governing Law</h2>
                        <p>
                            This Policy is governed by the laws of Sri Lanka, and disputes shall fall under Sri Lankan jurisdiction.
                        </p>

                        <h2 className="text-zinc-900">14. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Prime One Global IT or Internet services, you confirm that you have read, understood, and agreed to this Policy.
                        </p>

                        <h2 className="text-zinc-900">15. IT Support Contact</h2>
                        <p>
                            For connectivity issues or security concerns:<br />
                            Email: <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a><br />
                            Phone: 070 623 3612
                        </p>
                    </CardContent>
                </Card>

                <div className="mt-8 flex gap-4 flex-wrap justify-center md:justify-start">
                    <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
                        <Link href="/policies/terms">Terms of Service</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
                        <Link href="/policies/privacy">Privacy Policy</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
                        <Link href="/policies/cancellation">Cancellation Policy</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
                        <Link href="/policies/refund">Refund Policy</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
