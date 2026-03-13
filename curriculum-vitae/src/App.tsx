import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Experience } from './components/Experience'
import { Education } from './components/Education'
import { Skills } from './components/Skills'
import { Footer } from './components/Footer'
import data from '../data.json'

function App() {
  return (
    <div className="bg-[#0b1120] text-slate-300 min-h-screen bg-grid">
      <Navbar name={data.personal_info.name} />
      <Hero 
        info={data.personal_info} 
        education={data.education} 
        skills={data.skills} 
      />
      <Experience experience={data.experience} />
      <Education education={data.education} />
      <Skills skills={data.skills} />
      <Footer />
    </div>
  )
}

export default App
