import React from 'react'
import Welcome from '../Components/Welcome'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
function Home() {
  return (
    <div>
    <div className="gradient-bg-welcome pt-20">
     {/* <Navbar></Navbar> */}
     <Welcome></Welcome>
     </div>
     <Footer/> 
    </div>
  )
}

export default Home