import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldCheck, CreditCard, Mail, Search, Clock, CheckCircle } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function RefundPolicyPage() {
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
                                <RefreshCw size={24} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                                Refund <br /> <span className="italic font-light opacity-50 text-emerald-600 dark:text-emerald-400">Policy.</span>
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
                            <p className="text-lg font-medium">Thank you for booking with PrimeOne Coworking Space. This policy outlines our cancellation rules and your eligibility for refunds.</p>
                            <p>By scheduling a booking or utilizing our service, you seamlessly agree to this refund and cancellation protocol.</p>
                        </section>

                        {/* Cancellation Windows */}
                        <section className="space-y-8 bg-primary/5 p-8 lg:p-12 rounded-[2.5rem] border border-primary/10">
                            <div className="flex items-center gap-3">
                                <Clock className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Cancellation Windows</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Full Refund</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-4">&gt; 24 Hours Prior</p>
                                    <p className="text-sm opacity-80">Cancel at least 24 hours before your structurally scheduled booking to receive a 100% refund of your initial deposit or full payment.</p>
                                </div>
                                <div className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Partial Refund</p>
                                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-4">&lt; 24 Hours Prior</p>
                                    <p className="text-sm opacity-80">Cancellations made within 24 hours of your active booking are functionally eligible for a maximum 50% systematic refund allocation.</p>
                                </div>
                            </div>
                        </section>

                        {/* Exception Rules */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Eligibility Guidelines</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider text-emerald-600">Non-Refundable Categories</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>Absolutely No-Shows without prior active notification</li>
                                            <li>Deliberately downgraded bookings finalized post-payment</li>
                                            <li>Specified promotional discounts expressly marked non-refundable</li>
                                        </ul>
                                    </div>
                                    <div className="bg-muted/30 p-6 rounded-2xl border border-border shadow-sm">
                                        <strong className="block text-foreground mb-4 font-mono text-xs uppercase tracking-wider text-emerald-600">Administrative Discretion</strong>
                                        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                            <li>Emergencies evaluated strictly on a distinct case-by-case basis</li>
                                            <li>Facility-driven functional downtime warrants automatic compensation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Processing */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4">Refund Processing</h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary text-primary-foreground p-8 lg:p-12 rounded-[2.5rem]">
                                <div className="flex-1 space-y-4">
                                    <p className="leading-relaxed opacity-90 font-medium">
                                        Once your formal refund payload is validated, financial procession will be automatically initiated to your exact original operational payment credential.
                                    </p>
                                    <ul className="list-none space-y-2 opacity-90 text-sm">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Refunds typically dictate 3-5 routine business days</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Minor delays may structurally occur due to gateway caching</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Standard bank operational speeds govern final clearing</li>
                                    </ul>
                                </div>
                                <div className="w-full md:w-32 aspect-square border border-primary-foreground/20 rounded-3xl flex items-center justify-center relative overflow-hidden group bg-black/10 shrink-0">
                                    <CheckCircle size={40} className="text-emerald-300 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                        </section>

                        {/* Requesting Refund */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <Search className="text-emerald-600 dark:text-emerald-400" size={24} />
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">How to Request</h2>
                            </div>
                            <p>To safely request standard eligible refunds:</p>
                            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                                {[
                                    "Log into your PrimeOne User Account portal",
                                    "Navigate swiftly to the 'My Bookings' Dashboard interface",
                                    "Select standard 'Cancel Booking' directly on your active reservation",
                                    "Our system architecture automatically calculates eligible returns"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm opacity-60 italic mt-4">Alternatively, you may formally contact functional support via sanctioned channels.</p>
                        </section>

                        {/* Contact */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground border-b border-border pb-4 font-mono text-sm tracking-[0.3em]">Contact Billing</h2>
                            <p>For explicit billing inquiries or strictly refund operational disputes:</p>
                            <div className="bg-background p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between group cursor-pointer border border-border shadow-md gap-6">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-50 mb-2">PrimeOne Billing Support</p>
                                    <a href="mailto:support@primeone.space" className="text-xl md:text-2xl font-bold tracking-tighter text-foreground hover:underline">
                                        support@primeone.space
                                    </a>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                                    <Mail size={20} />
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4 pt-8">
                                <Link href="/privacy" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Privacy Policy</Link>
                                <span className="opacity-30">|</span>
                                <Link href="/terms" className="text-sm font-mono uppercase tracking-widest hover:text-primary underline underline-offset-4">Terms of Service</Link>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
