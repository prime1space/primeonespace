import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Mail, Fingerprint, Eye, Database, Globe } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function PrivacyPage() {
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
                                <ShieldCheck size={24} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                                Privacy <br /> <span className="italic font-light opacity-50 text-emerald-600 dark:text-emerald-400">Policy.</span>
                            </h1>
                        </div>
                        <p className="text-sm font-mono opacity-50 uppercase tracking-widest">Last updated: February 16, 2026</p>
                    </div>

                    {/* Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-none text-foreground/80 leading-relaxed space-y-16"
                    >
                        <section className="space-y-4">
                            <p className="text-lg font-medium">PrimeOne Coworking Space respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our services.</p>
                            <p>By using our Service, you consent to this Privacy Policy and our collection and use of information as described.</p>
                        </section>

                        {/* Collection */}
                        <section className="space-y-8 bg-primary/5 p-8 lg:p-12 rounded-[2.5rem] border border-primary/10">
                            <div className="flex items-center gap-3">
                                <Eye className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Collecting Your Data</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold mb-4">Information You Provide</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Account Info</strong>: Name, email address, phone number, password</li>
                                        <li><strong>Profile Info</strong>: Country, address, gender, emergency contact</li>
                                        <li><strong>Booking Info</strong>: Workspace preferences, dates, times, selections</li>
                                        <li><strong>Payment Info</strong>: Secure payment method details</li>
                                        <li><strong>Communications</strong>: Messages, support requests, feedback</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold mb-4">Automatically Collected</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Usage Data</strong>: Pages visited, features used, time spent</li>
                                        <li><strong>Device Info</strong>: IP address, browser type, operating system</li>
                                        <li><strong>Location Data</strong>: General location based on IP address</li>
                                        <li><strong>Cookies</strong>: Session, preference, and analytics cookies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Usage */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Use of Your Personal Data</h2>
                            <p>We use your data to maintain our Coworking Space effectively and securely:</p>
                            <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                                {[
                                    "Create and manage your account",
                                    "Process bookings and payments",
                                    "Send booking confirmations",
                                    "Optimize user experience",
                                    "Analyze overall usage patterns",
                                    "Provide customer support",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Rights */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Fingerprint className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Your Rights</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { title: "Access & Portability", desc: "Request a copy of your data or download it in a machine-readable format." },
                                        { title: "Correction & Deletion", desc: "Update incorrect information or request deletion of your account and data." },
                                        { title: "Restriction", desc: "Restrict processing of your data or object to marketing purposes." },
                                        { title: "Managing Cookies", desc: "You can adjust your browser settings to strictly block optional tracking cookies." }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                            <strong className="block text-foreground mb-2 font-mono text-xs uppercase tracking-wider">{item.title}</strong>
                                            <p className="text-sm opacity-80">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Retention */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <Database className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Data Retention</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Active</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">General Accounts</p>
                                    <p className="text-sm mt-3 opacity-80">Retained while your account is active</p>
                                </div>
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">2 Years</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">Inactive Accounts</p>
                                    <p className="text-sm mt-3 opacity-80">Scheduled for deletion after 2 years</p>
                                </div>
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">7 Years</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">Booking Records</p>
                                    <p className="text-sm mt-3 opacity-80">Retained for tax and legal purposes</p>
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Security of Your Data</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary text-primary-foreground p-8 lg:p-12 rounded-[2.5rem]">
                                <div className="flex-1">
                                    <p className="leading-relaxed opacity-90 mb-4">
                                        We strive to use commercially acceptable means to protect your Personal Data. We utilize encryption in transit (SSL/TLS), secure password hashing regularly, and comprehensive rate limiting to prevent attacks.
                                    </p>
                                    <p className="leading-relaxed opacity-90">
                                        You are strictly responsible for keeping your password secure and promptly reporting any suspicious activity on your account.
                                    </p>
                                </div>
                                <div className="w-full md:w-48 aspect-square border border-primary-foreground/20 rounded-3xl flex items-center justify-center relative overflow-hidden group bg-black/10">
                                    <Lock size={48} className="text-emerald-300 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4 font-mono text-sm tracking-[0.3em]">Contact Us</h2>
                            <p>If you have any questions or wish to officially exercise your privacy rights, contact us:</p>
                            <div className="bg-background p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between group cursor-pointer border border-border shadow-md gap-6">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-50 mb-2">Support & Legal</p>
                                    <a href="mailto:privacy@primeone.space" className="text-xl md:text-2xl font-bold tracking-tighter text-foreground hover:underline">
                                        privacy@primeone.space
                                    </a>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                                    <Mail size={20} />
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4 pt-8">
                                <Link href="/terms" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Terms of Service</Link>
                                <span className="opacity-30">|</span>
                                <Link href="/refund-policy" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Refund Policy</Link>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
