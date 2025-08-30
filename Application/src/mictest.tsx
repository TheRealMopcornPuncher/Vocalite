import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

function MicTest() {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [microphonesList, setMicrophonesList] = useState<string[]>([]);

  useEffect(() => {
    invoke<string[]>("list_microphones")
      .then(setMicrophonesList)
      .catch((err) => console.error("Failed to list microphones:", err));
  }, []);

  return (
    <div>
      <div className="mictest-card">
        <div className={`dropdown${isOpen ? ' open' : ''}`}>
          <button
            className="dropdownButton"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Microphone input
          </button>

          {isOpen && microphonesList.length > 0 && (
            <div className="dropdown-items">
              {microphonesList.map((mic, idx) => (
                <p key={idx}>{mic}</p>
              ))}
            </div>
          )}

          {isOpen && microphonesList.length === 0 && (
            <div className="dropdown-items">
              <p>No microphones found</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button className="mictest-back" onClick={() => nav('/')}>
          Back
        </button>
      </div>
    </div>
  );
}

export default MicTest;
