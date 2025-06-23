import { useState } from 'react'
import vocaliteLogo from '/Vocalite.svg'
import './App.css'

function App() {
  const [FadeStatus, setFadeStatus] = useState(false);

  return (
    <>
      <h1>Welcome to Vocalite!</h1>
      
      <div>  
        <img 
        src={vocaliteLogo} 
        className="logo" 
        alt="Vocalite logo"
        onClick = {() => setFadeStatus(true)}
        />

        <div className={FadeStatus ? "fadeout" : ""}>
          <p>Press logo to continue</p>
        </div>
      </div>
    </>
  )
}

export default App
