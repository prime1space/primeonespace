import Link from 'next/link';
import { ArrowLeft, Scale, ShieldAlert, CreditCard, Mail, AlignLeft, AlertCircle, FileText } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function TermsPage() {
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
                                <Scale size={24} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                                Terms of <br /> <span className="italic font-light opacity-50 text-emerald-600 dark:text-emerald-400">Service.</span>
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
                            <p className="text-lg font-medium">By accessing or using PrimeOne Coworking Space ("Service"), you expressly agree to be bound by these Terms of Service ("Terms").</p>
                            <p>If you disagree with any integral part of the terms, you may not access our services.</p>
                        </section>

                        {/* Description */}
                        <section className="space-y-8 bg-primary/5 p-8 lg:p-12 rounded-[2.5rem] border border-primary/10">
                            <div className="flex items-center gap-3">
                                <AlignLeft className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Description of Service</h2>
                            </div>
                            <p className="font-medium text-foreground py-2 border-l-2 border-primary/30 pl-4">PrimeOne provides coworking space booking and management services alongside supplementary offerings.</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Workspace booking (desks, offices, meeting rooms)",
                                    "Event registration and community management",
                                    "Detailed member profile and booking history",
                                    "Seamless payment processing for space rentals"
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-background/80 p-4 rounded-xl border border-border flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <p className="text-sm font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* User Accounts */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">User Accounts & Conduct</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider text-emerald-600">Registration</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>Must provide accurate and complete info</li>
                                            <li>Must be at least 18 years old</li>
                                            <li>Assume responsibility for account security</li>
                                        </ul>
                                    </div>
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider text-emerald-600">Community Guidelines</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>Do not violate laws or property rights</li>
                                            <li>Do not harass, abuse, or threaten users</li>
                                            <li>No unpermitted commercial pursuits</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Bookings */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Bookings & Payments</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary text-primary-foreground p-8 lg:p-12 rounded-[2.5rem]">
                                <div className="flex-1 space-y-4">
                                    <p className="leading-relaxed opacity-90 font-medium">
                                        Full or designated partial payment is mandatorily required at the time of booking confirmation. All prices will default to LKR (Sri Lankan Rupees).
                                    </p>
                                    <ul className="list-none space-y-2 opacity-90 text-sm">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Bookings subject to real-time availability</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> We reserve the right to limit bookings</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Prices actively subject to scheduled change</li>
                                    </ul>
                                </div>
                                <div className="w-full md:w-32 aspect-square border border-primary-foreground/20 rounded-3xl flex items-center justify-center relative overflow-hidden group bg-black/10 shrink-0">
                                    <CreditCard size={40} className="text-emerald-300 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                        </section>

                        {/* Intellectual Property */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Intellectual Property</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">Our Content</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-4">PrimeOne Platform</p>
                                    <p className="text-sm opacity-80">All embedded content and core features remain exclusively owned by PrimeOne. You may not duplicate or distribute without written permission.</p>
                                </div>
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">User Submissions</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-4">Your Content</p>
                                    <p className="text-sm opacity-80">You grant us a non-exclusive license to use submitted content exclusively for Service operation, while retaining baseline rights.</p>
                                </div>
                            </div>
                        </section>

                        {/* Liabilities & Termination */}
                        <section className="space-y-8 bg-muted/20 p-8 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border/50 pb-4">Liabilities & Termination</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-emerald-600" /> Warranty Disclaimers
                                    </h3>
                                    <p className="text-sm opacity-80">The structural Service is delivered "AS IS". We technically do not guarantee uninterrupted or error-free service intervals. Our total liability is financially limited to the aggregate amount you legitimately paid our entity within the preceding 12 months.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-emerald-600" /> Default Termination
                                    </h3>
                                    <p className="text-sm opacity-80">We may securely terminate or freeze your account ecosystem if you overtly violate these Terms or knowingly engage in demonstrable fraudulent systemic activity.</p>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4 font-mono text-sm tracking-[0.3em]">Contact Legal</h2>
                            <p>For official legal correspondences and clarifications regarding our Terms:</p>
                            <div className="bg-background p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between group cursor-pointer border border-border shadow-md gap-6">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-50 mb-2">PrimeOne Legal Desk</p>
                                    <a href="mailto:legal@primeone.space" className="text-xl md:text-2xl font-bold tracking-tighter text-foreground hover:underline">
                                        legal@primeone.space
                                    </a>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                                    <Mail size={20} />
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4 pt-8">
                                <Link href="/privacy" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Privacy Policy</Link>
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
