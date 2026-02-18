"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Quote } from "lucide-react";
import { baseURL } from "@/lib/auth-client";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${baseURL}/api/testimonials`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-primary">
            <span className="text-[#14212B] dark:text-white">What Our</span> Members Say
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from professionals and businesses thriving at PrimeOne Space
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-5xl font-bold mb-2">4.9</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-muted-foreground mt-2">Happy Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-5xl font-bold mb-2">98%</div>
              <p className="text-muted-foreground mt-2">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image || ""}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Experience the PrimeOne Space difference and see why members love working with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-foreground text-primary font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary-foreground text-primary-foreground font-medium hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              Schedule Tour
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
