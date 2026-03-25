import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css';

const Dashboard = () => {
    const [utente, setUtente] = useState(null);
    const [carte, setCarte] = useState([]);
    const [errore, setErrore] = useState('');
    const navigate = useNavigate();

    const fetchDati = async () => {
        const utenteId = localStorage.getItem('utenteId');
        try {
            const resUtente = await axios.get(`http://localhost:3001/api/utenti/${utenteId}`);
            setUtente(resUtente.data);

            const resCarte = await axios.get(`http://localhost:3001/api/carte/utente/${utenteId}`);
            setCarte(resCarte.data);
        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            setErrore('Impossibile caricare i dati.');
        }
    };

    useEffect(() => {
        const utenteId = localStorage.getItem('utenteId');

        if (utenteId === null) {
    navigate('/login');
    return;
}

if (utenteId === undefined) {
    navigate('/login');
    return;
}

if (utenteId === '') {
    navigate('/login');
    return;
}

        fetchDati();
    }, [navigate]);

    const rimuoviCarta = async (id) => {
        let conferma = window.confirm("Sei sicuro di volerla eliminare?");
        
        if (conferma === true) {
            try {
                await axios.delete(`http://localhost:3001/api/carte/${id}`);
                fetchDati();
            } catch (error) {
                console.error("Errore durante la rimozione:", error);
                alert("Impossibile rimuovere la carta.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('utenteId');
        navigate('/login');
    };

    if (utente === null && errore === '') {
        return <div className={"text-center mt-5 " + styles.textWhite}>Caricamento in corso...</div>;
    }

    let nomeDaMostrare = 'Utente';
    if (utente !== null) {
        nomeDaMostrare = utente.nome;
    }

    let saldoDaMostrare = '0.00';
    if (utente !== null) {
        if (utente.saldoSalvadanaio !== null) {
            saldoDaMostrare = utente.saldoSalvadanaio.toFixed(2);
        }
    }

    let contenutoCarte;
    if (carte.length === 0) {
        contenutoCarte = <p className={styles.textMuted}>Nessuna carta presente.</p>;
    } else {
        let listaElementi = [];
        for (let i = 0; i < carte.length; i = i + 1) {
            let cartaSingola = carte[i];
            listaElementi.push(
                <li key={cartaSingola.id} className="mb-3 p-2 border-bottom border-white border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="fw-bold">{cartaSingola.numero}</span>
                            <br />
                            <small className={styles.textMuted}>{cartaSingola.intestatario}</small>
                        </div>
                        <button 
                            onClick={() => rimuoviCarta(cartaSingola.id)} 
                            className="btn btn-danger btn-sm"
                            style={{fontSize: '10px', padding: '2px 5px'}}
                        >
                            Rimuovi
                        </button>
                    </div>
                </li>
            );
        }
        contenutoCarte = <ul className="list-unstyled">{listaElementi}</ul>;
    }

    let visualizzazioneErrore = null;
    if (errore !== '') {
        visualizzazioneErrore = <div className="alert alert-danger mb-4">{errore}</div>;
    }

    return (
        <div className={"container mt-5 " + styles.textWhite}>
            
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fw-bold m-0">Ciao, {nomeDaMostrare}!</h1>
                <button onClick={handleLogout} className="btn btn-outline-light">
                    Esci
                </button>
            </div>

            {visualizzazioneErrore}

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6">
                    <div className={styles.cardInfo + " " + styles.cardSaldo}>
                        <h3 className={styles.cardLabel}>Saldo Salvadanaio</h3>
                        <div className={styles.cardContent}>
                            <h2 className={styles.saldoValore}>€ {saldoDaMostrare}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className={styles.cardInfo + " " + styles.cardCarte}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className={styles.cardLabel + " m-0"}>Le tue Carte</h3>
                            <button onClick={() => navigate('/aggiungi-carta')} className="btn btn-light btn-sm fw-bold">
                                + Aggiungi
                            </button>
                        </div>
                        <div className={styles.cardContent}>
                            {contenutoCarte}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className={styles.cardGrafico}>
                        <h3 className={styles.cardLabel + " mb-4"}>Andamento Salvadanaio</h3>
                        <div className={styles.graficoPlaceholder}>
                            <p className={styles.textMuted}>Grafico non disponibile al momento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;