import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import vocaliteLogo from '/Vocalite.svg'
import woahhhImg from './Assets/woahhh.png'
import './App.css'
import Settings from './settings'
import NotFound from './404'

function App() {
  const [fadeStatus, setFadeStatus] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState('Idle')
  const [logs, setLogs] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'VOCALITE'

    // Subscribe to backend events
    let unlistenStdout: (() => void) | undefined
    let unlistenStderr: (() => void) | undefined

    ;(async () => {
      unlistenStdout = await listen<string>('recording-stdout', (event) => {
        setLogs((logs) => [...logs, `OUT: ${event.payload}`])
      })

      unlistenStderr = await listen<string>('recording-stderr', (event) => {
        setLogs((logs) => [...logs, `ERR: ${event.payload}`])
      })
    })()

    return () => {
      if (unlistenStdout) unlistenStdout()
      if (unlistenStderr) unlistenStderr()
    }
  }, [])

  // Start recording command
  const startRecording = () => {
    invoke('start_recording')
      .then(() => setRecordingStatus('Recording started'))
      .catch((err: unknown) => setRecordingStatus(`Error: ${String(err)}`))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {fadeStatus ? (
              <div className="replacement-div">
                <img
                  src={woahhhImg}
                  alt="Woahhh"
                  style={{ width: '150px', display: 'block', margin: '0 auto' }}
                />
                <h1 style={{ marginTop: 0 }}>Menu options</h1>
                <button className="mainmenu-button" onClick={startRecording}>
                  Start Recording
                </button>
                <button className="mainmenu-button">Link discord</button>
                <button className="mainmenu-button" onClick={() => navigate('/settings')}>
                  Settings
                </button>
                <button className="mainmenu-button" onClick={() => window.close()}>
                  Shutdown
                </button>

                {/* Optional: display logs */}
                <div style={{ marginTop: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                  <h3>Recorder Logs:</h3>
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Status: <span style={{ color: recordingStatus.includes('Error') ? 'red' : 'lime' }}>{recordingStatus}</span>
                  </p>
                  <pre
                    style={{
                      fontSize: '0.75rem',
                      background: '#222',
                      color: '#0f0',
                      padding: '0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    {logs.join('\n')}
                  </pre>
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
