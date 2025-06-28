import { useEffect, useState } from 'react'
import './App.css'
import './settings.css'

function Settings() {
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
        </div>
    );
}

export default Settings
