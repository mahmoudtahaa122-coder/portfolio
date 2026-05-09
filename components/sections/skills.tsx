"use client"

import { 
  Network, 
  Server, 
  Code2, 
  Users, 
  Terminal,
  Wifi,
  Monitor,
  FileCode,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const skillCategories = [
  {
    title: "Networking",
    icon: Network,
    skills: [
      { name: "Routing & Switching", level: 90 },
      { name: "TCP/IP", level: 95 },
      { name: "DNS & DHCP", level: 85 },
      { name: "VLANs & STP", level: 85 },
      { name: "OSPF", level: 80 },
      { name: "BNG/AAA/DPI", level: 75 },
      { name: "ISP Architecture", level: 80 },
      { name: "Network Troubleshooting", level: 90 },
    ]
  },
  {
    title: "Systems & Tools",
    icon: Server,
    skills: [
      { name: "Linux", level: 75 },
      { name: "Windows Server (MCSA)", level: 70 },
      { name: "Cisco IOS", level: 85 },
      { name: "Python Automation", level: 80 },
      { name: "Netmiko", level: 80 },
      { name: "Microsoft Office", level: 90 },
      { name: "Adobe Creative Suite", level: 75 },
    ]
  },
  {
    title: "Soft Skills",
    icon: Users,
    skills: [
      { name: "Communication", level: 90 },
      { name: "Problem-Solving", level: 95 },
      { name: "Teamwork", level: 90 },
      { name: "Adaptability", level: 85 },
      { name: "Leadership", level: 80 },
      { name: "Teaching", level: 85 },
    ]
  },
]

const techIcons = [
  { name: "Python", icon: Code2 },
  { name: "Cisco", icon: Network },
  { name: "Linux", icon: Terminal },
  { name: "Networking", icon: Wifi },
  { name: "Windows Server", icon: Monitor },
  { name: "Scripting", icon: FileCode },
]

function AnimatedProgressBar({ level, delay = 0 }: { level: number; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setWidth(level)
      }, delay * 100)
      return () => clearTimeout(timer)
    }
  }, [isInView, level, delay])

  return (
    <div ref={ref} className="h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  )
}

export function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" className="py-20 sm:py-32" ref={ref}>
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
              Skills & Expertise
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical competencies and professional skills developed through education and hands-on experience.
          </p>
        </motion.div>

        {/* Tech Icons Row */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {techIcons.map((tech, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.15, y: -5 }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-default"
            >
              <tech.icon className="h-8 w-8 text-primary" />
              <span className="text-xs text-muted-foreground">{tech.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <category.icon className="h-5 w-5 text-primary" />
                    </motion.div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <AnimatedProgressBar level={skill.level} delay={skillIndex} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
