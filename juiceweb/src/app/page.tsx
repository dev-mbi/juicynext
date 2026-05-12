import Header from "@/components/Header"
import Hero from "@/components/Hero"
import MangoCollection from "@/components/MangoCollection"
import FutureFlavors from "@/components/FutureFlavors"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MangoCollection />
        <FutureFlavors />
      </main>
      <Footer />
    </>
  )
}
