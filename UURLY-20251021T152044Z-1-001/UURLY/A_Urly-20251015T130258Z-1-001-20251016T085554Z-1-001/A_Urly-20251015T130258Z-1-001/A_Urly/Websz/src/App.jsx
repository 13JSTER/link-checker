import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import ConfigButton from './components/ConfigButton'
import ConfigPanel from './components/ConfigPanel'

export default function App(){
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
      
      {/* Configuration System - Available on all pages */}
      <ConfigButton onClick={() => setIsConfigOpen(true)} />
      <ConfigPanel isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </>
  )
}
