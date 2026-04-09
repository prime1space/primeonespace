import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Mail, Wifi, Globe, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function ITPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
            <main className="pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-8"
                        >
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-md">
                                <Wifi size={24} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                                IT Access <br /> <span className="italic font-light opacity-50 text-emerald-600 dark:text-emerald-400">Policy.</span>
                            </h1>
                        </div>
                        <p className="text-sm font-mono opacity-50 uppercase tracking-widest">Last updated: February 2026</p>
                    </div>

                    {/* Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-none text-foreground/80 leading-relaxed space-y-16"
                    >
                        <section className="space-y-4">
                            <p className="text-lg font-medium">Prime One Global (Pvt) Ltd provides Community workspace facilities that include shared IT infrastructure and Internet access.</p>
                            <p>This policy explains how our IT and Internet services may be used, the limitations of those services, and your responsibilities while accessing connectivity.</p>
                        </section>

                        {/* Scope */}
                        <section className="space-y-8 bg-primary/5 p-8 lg:p-12 rounded-[2.5rem] border border-primary/10">
                            <div className="flex items-center gap-3">
                                <Globe className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Scope & Services</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold mb-4">Applicability</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Users</strong>: Members, tenants, clients, visitors, guests</li>
                                        <li><strong>Devices</strong>: All personal or business devices used for access</li>
                                        <li><strong>Methods</strong>: Wired connections, Wi-Fi, and any connectivity provided</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold mb-4">Provided Services</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Shared wired and/or wireless Internet access</li>
                                        <li>Network infrastructure within workspace premises</li>
                                        <li>Basic security controls (firewalls, traffic filtering)</li>
                                        <li>Connectivity support for access availability</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Acceptable Use */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Acceptable Use</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider">Permitted Activities</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>General business and professional requirements</li>
                                            <li>Meetings, video calls, active cloud services</li>
                                            <li>Activities consistent with your membership plan</li>
                                        </ul>
                                    </div>
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider text-emerald-600">Strictly Prohibited</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>Violating Sri Lankan laws or regulations</li>
                                            <li>Accessing/transmitting illegal or abusive content</li>
                                            <li>Introducing malware, viruses, or ransomware</li>
                                            <li>Hacking, sniffing, or localized network attacks</li>
                                            <li>Reselling or redistributing our Internet access</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Availability */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Service Limitations</h2>
                            <p>Our operational services are provided "as is" and subject to:</p>
                            <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                                {[
                                    "No guaranteed minimum bandwidth speeds",
                                    "Routine maintenance interruptions",
                                    "Temporary power or ISP outages",
                                    "Unified fair-use bandwidth controls",
                                    "Device-specific hardware restrictions",
                                    "Security event isolations"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Security */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Security & Monitoring</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary text-primary-foreground p-8 lg:p-12 rounded-[2.5rem]">
                                <div className="flex-1 space-y-4">
                                    <p className="leading-relaxed opacity-90 font-medium mb-4">
                                        No shared network or Internet service is completely secure. You explicitly acknowledge that network traffic may be strictly monitored logically to uphold local security perimeters.
                                    </p>
                                    <p className="leading-relaxed opacity-90 text-sm">
                                        You are exclusively responsible for maintaining your unique device configurations organically secure and remarkably free from malware. We explicitly waive accountability regarding physical loss to your hardware or potential digital compromise on our shared layer.
                                    </p>
                                </div>
                                <div className="w-full md:w-32 aspect-square border border-primary-foreground/20 rounded-3xl flex items-center justify-center relative overflow-hidden group bg-black/10 shrink-0">
                                    <ShieldCheck size={40} className="text-emerald-300 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4 font-mono text-sm tracking-[0.3em]">IT Support</h2>
                            <p>For explicit connectivity issues or security disputes, please contact us:</p>
                            <div className="bg-background p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between group cursor-pointer border border-border shadow-md gap-6">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-50 mb-2">Technical Assistance</p>
                                    <a href="mailto:hello@primeone.space" className="text-xl md:text-2xl font-bold tracking-tighter text-foreground hover:underline">
                                        hello@primeone.space
                                    </a>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                                    <Mail size={20} />
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4 pt-8">
                                <Link href="/terms" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Terms of Service</Link>
                                <span className="opacity-30">|</span>
                                <Link href="/privacy" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Privacy Policy</Link>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
