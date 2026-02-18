"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageSquare, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-[#14212B] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
              <MessageSquare className="w-3.5 h-3.5 mr-2 text-primary fill-primary" />
              We're Here to Help
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Have a question about our spaces? We’d love to assist. Simply drop us a line and we'll get back to you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
              <CardContent className="p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        className="h-12 bg-muted/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 bg-muted/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="h-12 bg-muted/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        disabled={loading}
                      >
                        <SelectTrigger className="h-12 bg-muted/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary">
                          <SelectValue placeholder="Choose a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tour">Schedule a Tour</SelectItem>
                          <SelectItem value="booking">Booking Inquiry</SelectItem>
                          <SelectItem value="membership">Membership Plans</SelectItem>
                          <SelectItem value="event">Event Hosting</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Your Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="resize-none bg-muted/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary p-4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-base font-bold bg-primary hover:bg-[#14212B] text-white transition-all shadow-lg hover:shadow-primary/20" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Info Card */}
            <div className="bg-background border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
              <h3 className="font-bold text-xl mb-6">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-1">Our Location</h4>
                    <p className="font-medium text-foreground leading-relaxed">
                      146B, Goodshed Road,<br />Thonikkal, Vavuniya, NP, Sri Lanka.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-1">Phone Number</h4>
                    <a href="tel:+94706233612" className="font-medium text-foreground hover:text-primary transition-colors block text-lg whitespace-nowrap">
                      +94 70 623 3612
                    </a>
                    <span className="text-xs text-muted-foreground">Mon-Fri 9am-6pm</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-1">Email Address</h4>
                    <a href="mailto:hello@primeone.space" className="font-medium text-foreground hover:text-primary transition-colors block text-lg">
                      hello@primeone.space
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-[#14212B] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4">Ready to Visit?</h3>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  Experience the vibe yourself. Book a free guided tour of our spaces today.
                </p>
                <Button variant="outline" className="w-full h-12 border-white/20 text-black hover:bg-white hover:text-black font-bold transition-all">
                  Schedule a Tour <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 rounded-3xl overflow-hidden shadow-2xl h-[400px] border-4 border-white dark:border-zinc-800"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15783.565809798083!2d80.49390235!3d8.75421235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afc1507d3330d4b%3A0x62391054236a28!2sVavuniya!5e0!3m2!1sen!2slk!4v1714567890123!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="dark:invert dark:hue-rotate-180"
          />
        </motion.div>
      </div>
    </div>
  );
}
