import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import fYouImg from './Assets/f_YOU.png'
import './404.css'

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = '404 - Not Found';
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timer); // Reset timer when component unmounts
    }, [navigate]);

    return (
        <div className="card">
            <img src={fYouImg} alt="Evil deebil" style={{ width: '120px', display: 'block', margin: '0 auto' }} />
            <h1 style={{ marginTop: 0 }}>HTML Error Code: 404</h1>
            <p>Either you just tried visiting something that doesn't exist, or my server is stupid</p>
            <p>I'll send you back to the homepage in 5 secs :P</p>
        </div>
    );
}

export default NotFound