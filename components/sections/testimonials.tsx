"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star, Linkedin } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    name: "Ahmed M. Awad",
    role: "Entry Level DevOps Engineer",
    relationship: "Worked with Mahmoud on the same team",
    date: "August 21, 2024",
    content: "I highly recommend Mahmoud Taha for any position or project that requires a dedicated and skilled individual. Mahmoud is a highly motivated and hardworking individual who consistently delivers outstanding results. He is not only an expert in his field but also possesses excellent communication and interpersonal skills, making him a valuable asset to any team. Mahmoud's ability to think critically and creatively problem-solve sets him apart from his peers, and his positive attitude makes him a pleasure to work with. I have no doubt that Mahmoud would excel in any role he takes on, and I wholeheartedly endorse him for any opportunity that comes his way.",
    linkedin: "https://www.linkedin.com/in/ahmed-m-awad-b6547919b",
    rating: 5
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 sm:py-32 bg-secondary/20" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Recommendations
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What colleagues and mentors say about working with me.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-all relative overflow-hidden">
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-24 w-24 text-primary" />
                </div>

                <CardContent className="p-8 relative">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground text-lg leading-relaxed mb-8 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} &bull; {testimonial.relationship}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={testimonial.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="View on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
