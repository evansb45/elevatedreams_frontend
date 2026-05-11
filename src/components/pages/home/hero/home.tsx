'use client'

import { FC, useEffect, useState } from 'react'
import LeftComp from './left-comp'
import Navigation from './navigation'

type Props = {}
const HomeHero: FC<Props> = ({}) => {
  const list = ['/images/hero/img2.png', 'images/hero/img3.png']
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length)
  }

  const interval = 5000

  useEffect(() => {
    const intervalId = setInterval(nextSlide, interval)

    return () => clearInterval(intervalId)
  }, [currentIndex, interval])

  return (
    <div className="w-full h-[665px] flex lg:h-[850px] pt-32 relative">
      {list.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] object-top ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute top-0 left-0 h-full bg-gradient-to-r md:from-35% lg:from-30% w-full from-slate-950 ">
        <div className="def-contain">
          <div className="lg:mt-40 mt-28 grid grid-cols-1 lg:grid-cols-2">
            <LeftComp />
            <Navigation
              currentIndex={currentIndex}
              list={list}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomeHero
