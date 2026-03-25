import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css';

const AggiungiCarta = () => {
    const [numero, setNumero] = useState('');
    const [intestatario, setIntestatario] = useState('');
    const [scadenza, setScadenza] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const utenteId = localStorage.getItem('utenteId');

        const nuovaCarta = {
            utenteId: parseInt(utenteId),
            numero: numero,
            intestatario: intestatario,
            scadenza: scadenza
        };

        try {
            await axios.post('http://localhost:3001/api/carte', nuovaCarta);
            navigate('/dashboard');
        } catch (error) {
            console.error("Errore nell'aggiunta della carta:", error);
            alert("Errore durante il salvataggio.");
        }
    };

    return (
        <div className="container mt-5 text-white">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className={styles.cardGrafico}>
                        <h2 className="mb-4">Collega una Carta</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Numero Carta</label>
                                <input type="text" className="form-control" placeholder="1234 5678 9012 3456"
                                value={numero} onChange={(e) => setNumero(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Intestatario</label>
                                <input type="text" className="form-control" 
                                placeholder="Nome e cognome"
                                value={intestatario} onChange={(e) => setIntestatario(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Scadenza (MM/AA)</label>
                                <input type="text" className="form-control"
                                placeholder="MM/AA"
                                value={scadenza} onChange={(e) => setScadenza(e.target.value)} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">Salva</button>
                                <button type="button" className="btn btn-outline-light" onClick={() => navigate('/dashboard')}>Annulla</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AggiungiCarta;