import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css';

const Dashboard = () => {
    const [utente, setUtente] = useState(null);
    const [errore, setErrore] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const utenteId = localStorage.getItem('utenteId');

        if (utenteId === null || utenteId === undefined || utenteId === '') {
            navigate('/login');
            return;
        }

        const fetchDatiUtente = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/utenti/${utenteId}`);
                setUtente(response.data);
            } catch (error) {
                console.error("Errore nel recupero dati:", error);
                setErrore('Impossibile caricare i dati del profilo.');
            }
        };

        fetchDatiUtente();
    }, [navigate]);

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

    let messaggioErrore = null;
    if (errore !== '') {
        messaggioErrore = <div className="alert alert-danger mb-4">{errore}</div>;
    }

    return (
        <div className={"container mt-5 " + styles.textWhite}>
            
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fw-bold m-0">Ciao, {nomeDaMostrare}!</h1>
                <button onClick={handleLogout} className="btn btn-outline-light">
                    Esci
                </button>
            </div>

            {messaggioErrore}

            <div className="row g-4 mb-5">
                
                <div className="col-12 col-md-6">
                    <div className={styles.cardInfo + " " + styles.cardSaldo}>
                        <h3 className={styles.cardLabel}>Saldo Salvadanaio</h3>
                        <div className={styles.cardContent}>
                            <h2 className={styles.saldoValore}>
                                € {saldoDaMostrare}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className={styles.cardInfo + " " + styles.cardCarte}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className={styles.cardLabel + " m-0"}>Le tue Carte</h3>
                            <button className="btn btn-light btn-sm fw-bold">
                                + Aggiungi
                            </button>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.textMuted}>Nessuna carta presente.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className={styles.cardGrafico}>
                        <h3 className={styles.cardLabel + " mb-4"}>Andamento Salvadanaio</h3>
                        <div className={styles.graficoPlaceholder}>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;