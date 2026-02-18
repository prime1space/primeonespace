"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Cookie, Shield, Activity, Settings, Target, Info } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-zinc-100 -ml-4 text-zinc-600">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
            <Cookie className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6">
            Cookie & Tracking Policy
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            We use cookies and similar technologies to help personalize content, tailor and measure ads,
            and provide a better experience. By clicking "Accept All" or turning on an option in
            Cookie Settings, you agree to this, as outlined in our Cookie Policy.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-sm overflow-hidden mb-12">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-100">

              {/* Sidebar / TOC */}
              <div className="md:col-span-4 bg-zinc-50 p-8 md:p-10 space-y-8">
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-3 text-sm text-zinc-600">
                    <li className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                      We use cookies to improve functionality and performance.
                    </li>
                    <li className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                      You can control or delete cookies via your browser settings.
                    </li>
                    <li className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                      Third-party services may also set cookies on our site.
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-zinc-200">
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-3">Last Updated</p>
                  <p className="text-sm font-medium text-zinc-900">February 10, 2026</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-8 p-8 md:p-12 prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-p:text-zinc-600 prose-p:leading-8">

                <h2>1. What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                  They allow the website to remember your actions and preferences (such as login, language, font size,
                  and other display preferences) over a period of time, so you don't have to keep re-entering them
                  whenever you come back to the site or browse from one page to another.
                </p>

                <h2 className="mt-12 mb-6">2. Types of Cookies We Use</h2>
                <div className="not-prose grid gap-6">

                  <div className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg mb-2">Essential Cookies</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          Necessary for the website to function responsibly. They enable core functionality such as
                          security, network management, and accessibility. You may disable these by changing your
                          browser settings, but this may affect how the website functions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg mb-2">Performance Cookies</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          These cookies allow us to count visits and traffic sources so we can measure and improve
                          the performance of our site. Compiling aggregated statistics helps us improve our
                          website structure and content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                        <Settings className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg mb-2">Functional Cookies</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          These enable the website to provide enhanced functionality and personalization. They may
                          be set by us or by third-party providers whose services we have added to our pages.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg mb-2">Targeting Cookies</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          These may be set through our site by our advertising partners to build a profile of
                          your interests and show you relevant adverts on other sites. They do not store
                          directly personal information but are based on uniquely identifying your browser
                          and internet device.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <h2 className="mt-12">3. Managing Cookies</h2>
                <p>
                  Most web browsers allow some control of most cookies through the browser settings. To find out
                  more about cookies, including how to see what cookies have been set, visit
                  <a href="https://www.aboutcookies.org" target="_blank" rel="noreferrer" className="text-primary no-underline hover:underline ml-1 font-medium">
                    www.aboutcookies.org
                  </a> or
                  <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-primary no-underline hover:underline ml-1 font-medium">
                    www.allaboutcookies.org
                  </a>.
                </p>
                <p>
                  You can set your browser not to accept cookies and the above websites tell you how to remove
                  cookies from your browser. However, in a few cases, some of our website features may not
                  function as a result.
                </p>

                <h2 className="mt-12">4. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies or other technologies, please email us at:<br />
                  <a href="mailto:privacy@primeone.lk" className="text-primary font-medium no-underline hover:underline">privacy@primeone.lk</a>
                </p>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600">
            <Link href="/policies/privacy">Privacy Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600">
            <Link href="/policies/terms">Terms of Service</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
