import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore('');

        try {
            const response = await axios.post('http://localhost:3001/api/utenti/login', { email, password });
            const utenteId = response.data.id; 
            
            localStorage.setItem('utenteId', utenteId);
            navigate('/dashboard');

        } catch (error) {
            console.error("Errore di login:", error);
            setErrore('Email o password non corretti. Riprova.');
        }
    };

    let bloccoErrore = "";
    if (errore !== '') {
        bloccoErrore = <div className="alert alert-danger text-center">{errore}</div>;
    }

    return (
        <div className={"w-100 d-flex justify-content-center align-items-center vh-100 " + styles.sfondoPagina}>
            <div className={"card shadow-lg border-0 p-4 " + styles.cardAuth}>
                <div className="text-center mb-4">
                    <i className={"bi bi-person-circle text-light " + styles.iconaAuth}></i>
                    <h2 className="fw-bold mt-2 text-light">Bentornato!</h2>
                    <p className="text-light">Accedi al tuo salvadanaio CentUp</p>
                </div>

                {bloccoErrore}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-light ">Email</label>
                        <input 
                            type="email" 
                            className="form-control border-0" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Inserisci qui la tua email"
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-light ">Password</label>
                        <input 
                            type="password" 
                            className="form-control border-0" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Inserisci qui la tua password"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-pill" >
                        Accedi
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-light small">
                        Non hai ancora un account? <Link to="/registrazione" className="text-light text-decoration-none fw-bold">Registrati ora</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;