import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Registrazione.module.css';

const Registrazione = ()=> {
    const[nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore('');

        try {
            await axios.post('http://localhost:3001/api/utenti', nuovoUtente);
            setSuccesso(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Errore di registrazione:", error);
            setErrore('Errore durante la registrazione. Riprova.');
        }
    };
   return (
        <div className={"w-100 d-flex justify-content-center align-items-center vh-100 " + styles.sfondoPagina}>
            <div className={"card shadow-lg border-0 p-4 " + styles.cardAuth}>
                <div className="text-center mb-4">
                    <i className={"bi bi-wallet2 text-success " + styles.iconaAuth}></i>
                    <h2 className="fw-bold mt-2">Crea Account</h2>
                    <p className="text-muted">Inizia a risparmiare con CentUp</p>
                </div>

                {successo && <div className="alert alert-success text-center">Registrazione completata! Reindirizzamento...</div>}
                {errore && <div className="alert alert-danger text-center">{errore}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold">Nome</label>
                        <input type="text" className="form-control bg-light border-0" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold">Cognome</label>
                        <input type="text" className="form-control bg-light border-0" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold">Email</label>
                        <input type="email" className="form-control bg-light border-0" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold">Password</label>
                        <input type="password" className="form-control bg-light border-0" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-pill">
                        Registrati
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted small">
                        Hai già un account? <Link to="/login" className="text-success text-decoration-none fw-bold">Accedi qui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registrazione;