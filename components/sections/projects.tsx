"use client"

import Link from "next/link"
import { ExternalLink, Github, Terminal, Library, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const projects = [
  {
    title: "Cisco Device Info Scanner",
    description: "Built a Python automation script using Netmiko to SSH into Cisco devices, retrieve interface status and device info, and export structured reports to CSV. Tested on Cisco DevNet Sandbox against live Cisco IOS devices.",
    techStack: ["Python", "Netmiko", "Cisco DevNet", "SSH", "CSV"],
    year: "2026",
    github: "https://github.com/mahmoudtahaa111"
  },
  {
    title: "Subnet Calculator & IP Planner CLI",
    description: "Developed a command-line tool for CIDR subnet breakdown, subnet splitting, and IP range validation using Python's ipaddress module. Supports CSV export of subnet plans; built to simulate a practical tool a network engineer would use daily.",
    techStack: ["Python", "ipaddress", "CLI", "CSV Export"],
    year: "2026",
    github: "https://github.com/mahmoudtahaa111"
  },
  {
    title: "Mushaf Digital Library",
    description: "Led a team of 12+ designers and reviewers to create a 70+ resource digital library actively used by 700+ monthly users. Reduced operational errors by 30% through efficient project management and quality control.",
    techStack: ["Adobe InDesign", "Photoshop", "Illustrator", "Project Management"],
    year: "2022",
    icon: Library
  }
]

const certifications = [
  {
    name: "CCNA Enterprise Networking, Security, and Automation",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/0f45a6e4-417a-4b65-83c5-58bfe85cfe04"
  },
  {
    name: "CCNA Switching, Routing & Wireless Essentials",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/b5b99cf7-52fa-4786-b523-2f2e430923c4"
  },
  {
    name: "CCNA Introduction to Networks",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/202e56d7-5585-4bef-8920-504dbbb39c4d"
  },
  {
    name: "Introduction to Network Automation",
    provider: "Cisco/Coursera",
    link: "https://coursera.org/account/accomplishments/records/ZWQ4YMQ07R7R"
  },
  {
    name: "Using APIs for Network Automation",
    provider: "Cisco/Coursera",
    link: "https://coursera.org/account/accomplishments/records/UD0UW9I17E7C"
  },
  {
    name: "Introduction to Git and GitHub",
    provider: "Google Cloud/Coursera",
    link: "https://coursera.org/account/accomplishments/records/UNNMFA7RZRQJ"
  },
]

export function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-20 sm:py-32 bg-secondary/20" ref={ref}>
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
              Projects & Certifications
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hands-on projects demonstrating network automation skills and professional certifications.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 group h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {project.icon ? (
                        <project.icon className="h-6 w-6 text-primary" />
                      ) : (
                        <Terminal className="h-6 w-6 text-primary" />
                      )}
                    </motion.div>
                    <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: techIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Links */}
                  {project.github && (
                    <div className="flex items-center gap-4">
                      <Button asChild variant="outline" size="sm" className="gap-2 hover:border-primary hover:text-primary transition-colors">
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          View Code
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Certifications
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Link href={cert.link} target="_blank" rel="noopener noreferrer">
                  <Card className="bg-card border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5 cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground block truncate group-hover:text-accent transition-colors">{cert.name}</span>
                        <span className="text-xs text-muted-foreground">{cert.provider}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
