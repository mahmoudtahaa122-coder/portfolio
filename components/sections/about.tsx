"use client"

import { GraduationCap, Building2, Calendar, MapPin, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const experiences = [
  {
    title: "Technical Instructor",
    company: "iSchool",
    location: "Egypt",
    period: "Nov 2024 – Dec 2024 | Mar 2026 – Present",
    description: "Teaching programming fundamentals using Python, Mblock, and Scratch. Applied modern teaching strategies including project-based learning and interactive sessions.",
    type: "work"
  },
  {
    title: "Military Service — Electronic Warfare Corps",
    company: "Egyptian Armed Forces",
    location: "Egypt",
    period: "Mar 2025 – Mar 2026",
    description: "Served in the Egyptian Army as part of mandatory national service, assigned to the Electronic Warfare branch.",
    type: "military"
  },
  {
    title: "Network VAS Engineer Intern",
    company: "Telecom Egypt (WE)",
    location: "Egypt",
    period: "Aug 2024 – Oct 2024",
    description: "Worked hands-on with Cisco-based ISP infrastructure including BNG, AAA, DNS, and DPI systems. Diagnosed and resolved live network faults across ISP layers.",
    type: "internship"
  },
  {
    title: "Network Administrator Intern",
    company: "Ministry of Communications (DEPI)",
    location: "Egypt",
    period: "Mar 2024 – Oct 2024",
    description: "Configured and troubleshot switching and routing protocols (VLANs, STP, OSPF) alongside TCP/IP, DNS, and DHCP in structured lab environments.",
    type: "internship"
  },
  {
    title: "Customer Support → Project Manager",
    company: "E-Alim Institute",
    location: "Egypt",
    period: "Jul 2022 – Oct 2022 | Jul 2023 – Sep 2023",
    description: "Supported 25+ customers daily, promoted to Project Manager. Launched a 70+ resource digital library used by 700+ users monthly. Reduced operational errors by 30%.",
    type: "work"
  },
  {
    title: "Data Center Training",
    company: "Telecom Egypt (WE)",
    location: "Egypt",
    period: "Aug 2022",
    description: "Assisted in managing data center networking equipment. Studied high-availability design principles including redundancy and failover.",
    type: "training"
  },
]

const education = {
  degree: "Bachelor's Degree in Engineering",
  field: "Communication, Electronics and Computer",
  school: "Helwan University",
  period: "Aug 2019 – Aug 2024",
  location: "Egypt",
  achievement: "Graduation Project Grade: Excellent"
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-20 sm:py-32" ref={ref}>
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
              About Me
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A brief overview of my background, education, and professional experience.
          </p>
        </motion.div>

        {/* Summary */}
        <AnimatedSection className="mb-12">
          <Card className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-6 sm:p-8">
              <p className="text-foreground leading-relaxed text-lg">
                Network Engineer graduate from Helwan University with hands-on experience in live Cisco-based ISP 
                environments at Telecom Egypt and the Ministry of Communications. Skilled in TCP/IP, DNS, DHCP, 
                switching, routing, and ISP architecture (BNG, AAA, DPI). Cisco Networking Academy certified with 
                practical automation skills in Python and a passion for network operations and infrastructure. 
                Familiar with Windows Server administration at MCSA level.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <AnimatedSection>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{education.degree}</h4>
                      <p className="text-primary font-medium">{education.field}</p>
                      <p className="text-muted-foreground mt-1">{education.school}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {education.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {education.location}
                        </span>
                      </div>
                      <p className="mt-3 text-accent font-medium">{education.achievement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>

          {/* Experience Timeline */}
          <AnimatedSection>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Experience
            </h3>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          exp.type === 'military' ? 'bg-amber-500' : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                            <h4 className="font-semibold text-foreground truncate">{exp.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                              exp.type === 'work' 
                                ? 'bg-primary/20 text-primary' 
                                : exp.type === 'internship'
                                ? 'bg-accent/20 text-accent'
                                : exp.type === 'military'
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {exp.type === 'military' ? 'national service' : exp.type}
                            </span>
                          </div>
                          <p className="text-primary text-sm font-medium">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
