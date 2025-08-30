import { useState } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import vocaliteLogo from '/Vocalite.svg'
import woahhhImg from './Assets/woahhh.png'
import './App.css'
import Settings from './settings'
import NotFound from './404'

function App() {
  const [fadeStatus, setFadeStatus] = useState(false)
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {fadeStatus ? (
              <div className="replacement-div">
                <img src={woahhhImg} alt="Woahhh" className="menu-img" />
                <h1 className="menu-title">Menu options</h1>
                <div className="menu-buttons">
                  <button className="mainmenu-button">Link discord</button>
                  <button className="mainmenu-button" onClick={() => navigate('/settings')}>Settings</button>
                  <button className="mainmenu-button" onClick={() => window.close()}>Shutdown</button>
                </div>
              </div>
            ) : (
              <div className={fadeStatus ? 'fadeout-right' : ''}>
                <h1>Welcome to Vocalite!</h1>
              </div>
            )}
            <div>
              <img
                src={vocaliteLogo}
                className={`logo${fadeStatus ? ' slide-bottom ' : ''}`}
                alt="Vocalite logo"
                onClick={() => setFadeStatus(true)}
              />
              <div className={fadeStatus ? 'fadeout-right' : ''}>
                <p>Press logo to continue</p>
              </div>
            </div>
          </>
        }
      />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
