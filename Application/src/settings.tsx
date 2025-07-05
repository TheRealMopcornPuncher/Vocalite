import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import './settings.css'

function Settings() {
    const navigate = useNavigate();

    // Load settings from localStorage on mount
    useEffect(() => {
        document.title = 'Settings';
        const savedVolume = localStorage.getItem('settings.volume');
        const savedOutput = localStorage.getItem('settings.output');
        const savedStartup = localStorage.getItem('settings.startup');
        if (savedVolume) setVolume(Number(savedVolume));
        if (savedOutput) setOutput(savedOutput);
        if (savedStartup) setStartup(savedStartup === 'true');
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [volume, setVolume] = useState(50);
    const [output, setOutput] = useState('discord');
    const [startup, setStartup] = useState(false);

    // Save settings to localStorage
    const handleSave = () => {
        localStorage.setItem('settings.volume', String(volume));
        localStorage.setItem('settings.output', output);
        localStorage.setItem('settings.startup', String(startup));
    };

    return (
        <div className="card">
            <div className={`dropdown${isOpen ? ' open' : ''}`}> 
                <button className="dropdownButton" onClick={() => setIsOpen((prev) => !prev)}>
                    Microphone input
                </button>
                <div className="dropdown-items">
                    <p>Item 1</p>
                    <p>Item 2</p>
                </div>
            </div>

            <div>
                <p className="compactParagraph">Audio/Text output</p>
                <p className="settingsParagraph">Output as speech</p>
                <label className="switch">
                    <input 
                        type="checkbox"
                        checked={output === 'speech'}
                        onChange={() => setOutput(output === 'speech' ? 'discord' : 'speech')}
                    />
                    <span className="toggle round"></span>
                </label>
                <p className="settingsParagraph">Output to discord</p>
            </div>

            <div>
                <p className="compactParagraph">Open on startup</p>
                <p className="settingsParagraph">No</p>
                <label className="switch">
                    <input 
                        type="checkbox"
                        checked={startup}
                        onChange={() => setStartup(!startup)}
                    />
                    <span className="toggle round"></span>
                </label>
                <p className="settingsParagraph">Yes</p>
            </div>

            <div className="sliderContainer">
                <p className="compactParagraph">Volume output</p>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={volume}
                    className="slider"
                    id="volumeSlider"
                    onChange={e => setVolume(Number(e.target.value))}
                />
            </div>

            <div>
                <button className="button" onClick={() => navigate('/')}>Back</button>
                <button className="button" onClick={handleSave}>Save</button> 
            </div>
        </div>
    );
}

export default Settings
