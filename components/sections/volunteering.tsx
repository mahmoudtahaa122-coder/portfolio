"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Camera, Palette, Calendar, MapPin } from "lucide-react"

const volunteerExperiences = [
  {
    organization: "E.A.S. Helwan",
    role: "Head of the Media Committee",
    period: "Sep 2019 – Aug 2021",
    location: "Helwan University, Egypt",
    description: "Led the media team, trained 13 members on design tools, and significantly improved the quality and consistency of produced content.",
    icon: Users,
    activities: ["Team Leadership", "Training & Mentorship", "Design Tools", "Quality Control"]
  },
  {
    organization: "Pixels Egypt",
    role: "Member of the Media Committee",
    period: "Aug 2021 – Dec 2022",
    location: "Egypt",
    description: "Led media production for events and competitions, contributing to measurable improvements in the team's design output and delivery speed.",
    icon: Palette,
    activities: ["Media Production", "Event Coverage", "Design Output", "Team Collaboration"]
  },
]

export function Volunteering() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 sm:py-32" ref={ref}>
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
              Community & Volunteering
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Giving back to the community through student organizations and creative initiatives.
          </p>
        </motion.div>

        {/* Volunteer Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {volunteerExperiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <exp.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{exp.organization}</h3>
                      <p className="text-primary font-medium">{exp.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Activities */}
                  <div className="flex flex-wrap gap-2">
                    {exp.activities.map((activity, actIndex) => (
                      <motion.span
                        key={actIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: actIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {activity}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Passionate about contributing to student communities and creative projects
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
