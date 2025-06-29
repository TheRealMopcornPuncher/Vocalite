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
                <p className="sliderParagraph">Output as speech</p>
                <label className="switch">
                    <input type="checkbox"/>
                    <span className="slider round"></span>
                </label>
                <p className="sliderParagraph">Output to discord</p>
            </div>

            <button className="button" onClick={() => navigate('/')}>Back</button>
        </div>
    );
}

export default Settings
