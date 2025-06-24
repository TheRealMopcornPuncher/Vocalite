import { useState } from 'react'
import vocaliteLogo from '/Vocalite.svg'
import './App.css'

function App() {
  const [fadeStatus, setFadeStatus] = useState(false);
  
  return (
    <>
      {fadeStatus ? (
        <div className="replacement-div">
          <h1>Menu options</h1>
          <button>Link discord</button>
          <button>Settings</button>
          <button>Shutdown</button>
        </div>
      ) : (
        <div className={fadeStatus? "fadeout-right" : ""}>
          <h1>Welcome to Vocalite!</h1>
        </div>
      )}
      
      <div>  
        <img 
        src={vocaliteLogo} 
        className={`logo${fadeStatus ? " slide-bottom " : ""}`} 
        alt="Vocalite logo"
        onClick = {() => setFadeStatus(true)}
        />

        <div className={fadeStatus? "fadeout-right" : ""}>
          <p>Press logo to continue</p>
        </div>
      </div>
    </>
  )
}

export default App
