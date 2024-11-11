import About from '../components/About'
import Contact from '../components/Contact'
import Gallery from '../components/Gallery'
import Hero from '../components/Hero'
import Map from '../components/Map'
import Services from '../components/Services'
import Videos from '../components/Videos'


export default function Home() {
  return (
    <>
      <Hero />
      <div className="px-3 lg:px-20">
        <Services />
        <About />
        <Videos />
        <Gallery />
        {/* <Blog /> */}
        <Contact />
        <Map />
      </div>
    </>
  )
}
