import { useState, useEffect } from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import vocaliteLogo from '/Vocalite.svg'
import './app.css'
import Settings from './settings'

function MainMenu() {
  const [fadeStatus, setFadeStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
          document.title = 'VOCALITE';
      }, []);
  
  return (
    <>
      {fadeStatus ? (
        <div className="replacement-div">
          <h1>Menu options</h1>
          <button>Link discord</button>
          <button onClick={() => navigate('/settings')}>Settings</button>
          <button onClick={() => window.close()}>Shutdown</button>
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
