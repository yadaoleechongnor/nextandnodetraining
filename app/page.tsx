import React from 'react'
import Register from './register'
import Getuser from './Getuser'
import Search from './Search'

export default function Home() {
  return (
    <div>
      <Search/>
      <Register/>
      <Getuser/>
    </div>
  )
}
