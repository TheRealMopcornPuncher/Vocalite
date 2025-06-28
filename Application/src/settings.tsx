import { useEffect } from 'react'
import './App.css'
import './settings.css'

function Settings() {
    useEffect(() => {
        document.title = 'Settings';
    }, []);

    return (
        <div className="card">
            <div className="dropdown">
                <button className="dropdownButton">Microphone input</button>
                <div className="dropdown-items">
                    <p>Item 1</p>
                    <p>Item 2</p>
                </div>
            </div>
        </div>
    );
}

export default Settings
