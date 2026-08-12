'use client'
import { useState, useEffect } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true)
    }, 1800) // Matches the original MVP delay

    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`page-loader ${hidden ? 'hidden' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'white',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: 'opacity 0.8s ease, visibility 0.8s ease',
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
      }}
    >
      <div className="serif text-5xl md:text-6xl gradient-text mb-6 tracking-tight">
        FindOneCampus
      </div>
      <div className="loader-line mb-6"></div>
      <div className="text-[11px] text-gray-400 tracking-[0.4em] uppercase">
        The World Is One Big Campus
      </div>
    </div>
  )
}