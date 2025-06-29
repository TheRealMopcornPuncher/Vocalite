import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './app.css'
import './settings.css'

function Settings() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Settings';
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [volume, setVolume] = useState(50);

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
                    <input type="checkbox"/>
                    <span className="toggle round"></span>
                </label>
                <p className="settingsParagraph">Output to discord</p>
            </div>

            <div>
                <p className="compactParagraph">Open on startup</p>
                <p className="settingsParagraph">No</p>
                <label className="switch">
                    <input type="checkbox"/>
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
                <button className="button">Save</button> 
            </div>
        </div>
    );
}

export default Settings
