import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Projects } from "@/components/sections/projects"
import { Skills } from "@/components/sections/skills"
import { Blog } from "@/components/sections/blog"

import { Testimonials } from "@/components/sections/testimonials"
import { Volunteering } from "@/components/sections/volunteering"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Blog />
      <Testimonials />
      <Volunteering />
      <Contact />
      <Footer />
    </main>
  )
}
