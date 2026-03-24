import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css';

const Dashboard = () => {
    const [utente, setUtente] = useState(null);
    const [errore, setErrore] = useState(false);
    
    const [obiettivo, setObiettivo] = useState(0);
    const [nuovoObiettivo, setNuovoObiettivo] = useState("");
    const [motivo, setMotivo] = useState("Risparmio");
    const [nuovoMotivo, setNuovoMotivo] = useState("Risparmio");
    
    const [isCustomMotivo, setIsCustomMotivo] = useState(false);
    const [isEditingObiettivo, setIsEditingObiettivo] = useState(false);

    const navigate = useNavigate();
    const utenteId = localStorage.getItem('utenteId');

    const opzioniMotivo = [
        { id: "Risparmio", icon: "bi-piggy-bank" },
        { id: "Casa", icon: "bi-house-door" },
        { id: "Macchina", icon: "bi-car-front" },
        { id: "Viaggio", icon: "bi-airplane" },
        { id: "Famiglia", icon: "bi-people" },
        { id: "Studio", icon: "bi-book" },
        { id: "Tecnologia", icon: "bi-laptop" },
        { id: "Altro...", icon: "bi-pencil-square" }
    ];

    useEffect(() => {
        if (!utenteId) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:3001/api/utenti/' + utenteId)
            .then(response => {
                setUtente(response.data);
                
                const obiettivoSalvato = localStorage.getItem('obiettivo_' + utenteId);
                setObiettivo(obiettivoSalvato ? parseFloat(obiettivoSalvato) : (response.data.obiettivoMensile || 100));

                const motivoSalvato = localStorage.getItem('motivo_' + utenteId);
                if (motivoSalvato) setMotivo(motivoSalvato);
            })
            .catch(error => {
                console.error("Errore axios:", error);
                setErrore(true);
            });
    }, [utenteId, navigate]);

    const handleSalvaObiettivo = () => {
        const valoreObiettivo = parseFloat(nuovoObiettivo);
        if (isNaN(valoreObiettivo) || valoreObiettivo <= 0) return; 

        setObiettivo(valoreObiettivo);
        localStorage.setItem('obiettivo_' + utenteId, valoreObiettivo);
        
        setMotivo(nuovoMotivo);
        localStorage.setItem('motivo_' + utenteId, nuovoMotivo);

        setIsEditingObiettivo(false);
        setIsCustomMotivo(false);
    };

    const handleSelectMotivo = (scelta) => {
        if (scelta === "Altro...") {
            setIsCustomMotivo(true);
            setNuovoMotivo("");
        } else {
            setIsCustomMotivo(false);
            setNuovoMotivo(scelta);
        }
    };

let saldo = 0;
if (utente !== null && utente.saldoSalvadanaio !== undefined) {
    saldo = utente.saldoSalvadanaio;
}

let percentuale = 0;
if (obiettivo > 0) {
    percentuale = (saldo / obiettivo) * 100;
    
    if (percentuale > 100) {
        percentuale = 100; 
    }
}


let traguardoRaggiunto = false;
if (saldo >= obiettivo && obiettivo > 0) {
    traguardoRaggiunto = true;
}

let coloreGrafico = '#602772ff'; 
if (traguardoRaggiunto === true) {
    coloreGrafico = '#157a4bff'; 
}

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5 fw-bold text-dark">
                La tua Dashboard {utente && "di " + utente.nome}
            </h2>
            
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow border-0 text-center p-4 rounded-4">
                        
                        <h4 className="fw-bold mb-4 text-secondary">
                            Obiettivo: {motivo}
                        </h4>

                        <div className="d-flex justify-content-center mb-5">
                            <div 
                                className={styles.cerchioEsterno}
                                style={{ background: "conic-gradient(" + coloreGrafico + " " + percentuale + "%, #f1f3f5 " + percentuale + "% 100%)" }}
                            >
                                <div className={styles.cerchioInterno}>
                                    <span className="text-muted fw-semibold mb-1">Saldo Totale</span>
                                    <h1 className="fw-bolder text-dark m-0" style={{ fontSize: '2.5rem' }}>
                                        € {saldo.toFixed(2)}
                                    </h1>
                                    <span className="text-muted mt-1 small">
                                        su € {obiettivo.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!isEditingObiettivo ? (
                            <div>
                                <button 
                                    className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                                    onClick={() => {
                                        setNuovoObiettivo(obiettivo);
                                        setNuovoMotivo(motivo);
                                        setIsCustomMotivo(false);
                                        setIsEditingObiettivo(true);
                                    }}
                                >
                                    <i className="bi bi-pencil-square me-2"></i>Modifica Traguardo
                                </button>
                            </div>
                        ) : (
                            <div className="bg-light p-4 rounded-4 shadow-sm mt-3">
                                <label className="form-label text-dark fw-bold mb-3">Scegli la categoria:</label>
                                
                                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                    {opzioniMotivo.map((opz) => {
                                        const isSelected = nuovoMotivo === opz.id || (isCustomMotivo && opz.id === "Altro...");
                                        
                                        let classiBootstrap = "btn d-flex flex-column align-items-center justify-content-center ";
                                        if (isSelected) {
                                            classiBootstrap = classiBootstrap + "btn-primary shadow ";
                                        } else {
                                            classiBootstrap = classiBootstrap + "btn-outline-secondary border-0 bg-white shadow-sm ";
                                        }

                                        return (
                                            <button
                                                key={opz.id}
                                                type="button"
                                                className={classiBootstrap + styles.bottoneCategoria}
                                                onClick={() => handleSelectMotivo(opz.id)}
                                            >
                                                <i className={"bi fs-3 mb-1 " + opz.icon + (isSelected ? " text-white" : " text-primary")}></i>
                                                <span className={styles.testoPiccolo}>{opz.id}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {isCustomMotivo && (
                                    <div className="mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control text-center rounded-pill" 
                                            placeholder="Scrivi il tuo obiettivo..."
                                            value={nuovoMotivo === "Altro..." ? "" : nuovoMotivo}
                                            onChange={(e) => setNuovoMotivo(e.target.value)}
                                            maxLength="20"
                                        />
                                    </div>
                                )}

                                <label className="form-label text-dark fw-bold mt-2">Importo da raggiungere (€):</label>
                                <input 
                                    type="number" 
                                    className="form-control mb-4 w-50 mx-auto text-center rounded-pill fs-5" 
                                    value={nuovoObiettivo}
                                    onChange={(e) => setNuovoObiettivo(e.target.value)}
                                    min="1"
                                />

                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-success rounded-pill px-4" onClick={handleSalvaObiettivo}>
                                        <i className="bi bi-check-lg me-2"></i>Salva
                                    </button>
                                    <button className="btn btn-light rounded-pill px-4 text-danger" onClick={() => setIsEditingObiettivo(false)}>
                                        Annulla
                                    </button>
                                </div>
                            </div>
                        )}

                        {traguardoRaggiunto && (
                            <div className="alert alert-success mt-5 p-4 border-0 text-center shadow rounded-4" style={{ backgroundColor: '#d1e7dd' }}>
                                <i className="bi bi-trophy-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                                <h4 className="text-success fw-bold mt-2 mb-2">Traguardo Raggiunto!</h4>
                                <p className="mb-4 text-dark">Hai completato il risparmio per: <strong>{motivo}</strong></p>
                            </div>
                        )}
                        
                        {errore && <p className="text-danger mt-3 small">Errore caricamento dati dal server. Assicurati che il backend Java sia acceso.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;