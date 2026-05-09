"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Calendar, Clock, Network, Code2, Shield, Terminal } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    title: "Understanding OSPF: A Complete Guide for CCNA Students",
    excerpt: "Deep dive into OSPF routing protocol, covering areas, LSAs, neighbor relationships, and practical configuration examples on Cisco devices.",
    icon: Network,
    category: "Networking",
    readTime: "12 min read",
    date: "Mar 2026",
    tags: ["OSPF", "CCNA", "Routing"],
    slug: "understanding-ospf"
  },
  {
    title: "Network Automation with Python: Building a Cisco Device Scanner",
    excerpt: "Learn how to automate network device management using Python and Netmiko. Includes code examples for SSH connections and data extraction.",
    icon: Code2,
    category: "Automation",
    readTime: "15 min read",
    date: "Feb 2026",
    tags: ["Python", "Netmiko", "Automation"],
    slug: "network-automation-python"
  },
  {
    title: "Securing Your Network: ACL Best Practices",
    excerpt: "Comprehensive guide to implementing Access Control Lists for enterprise network security. Covers standard, extended, and named ACLs.",
    icon: Shield,
    category: "Security",
    readTime: "10 min read",
    date: "Jan 2026",
    tags: ["Security", "ACLs", "Cisco"],
    slug: "acl-best-practices"
  },
  {
    title: "Building a Subnet Calculator CLI Tool in Python",
    excerpt: "Step-by-step tutorial on creating a command-line subnet calculator using Python's ipaddress module. Perfect for network engineers.",
    icon: Terminal,
    category: "Development",
    readTime: "8 min read",
    date: "Dec 2025",
    tags: ["Python", "Subnetting", "CLI"],
    slug: "subnet-calculator-python"
  },
]

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="blog" className="py-20 sm:py-32" ref={ref}>
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
              Blog & Insights
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical articles and tutorials sharing knowledge about networking, automation, and security.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/blog/${post.slug}`}>
              <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 group h-full cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <post.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog/understanding-ospf"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <BookOpen className="h-4 w-4" />
            Start reading
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
