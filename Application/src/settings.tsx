import { useEffect } from 'react'
import './App.css'

function Settings() {
    useEffect(() => {
        document.title = 'Settings';
    }, []);

    return (
        <div>
            <h1>Testing page, fill in later</h1>
        </div>
    );
}

export default Settings
