import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css'; 

const AggiungiCarta = () => {
    const [numeroCarta, setNumeroCarta] = useState('');
    const [intestatario, setIntestatario] = useState('');
    const [scadenza, setScadenza] = useState('');
    
    const navigazione = useNavigate();

    const gestisciCambioCarta = (evento) => {
        let valore = evento.target.value;
        let soloNumeri = valore.replace(/\D/g, '');
        
        let risultato = '';
        for (let i = 0; i < soloNumeri.length; i++) {
            if (i > 0 && i % 4 === 0) {
                risultato += ' ';
            }
            risultato += soloNumeri[i];
        }

        if (risultato.length > 19) {
            risultato = risultato.substring(0, 19);
        }
        
        setNumeroCarta(risultato);
    };

    const gestisciCambioScadenza = (evento) => {
        let valore = evento.target.value;
        let soloNumeri = valore.replace(/\D/g, '');

        let risultato = '';
        if (soloNumeri.length > 2) {
            let mese = soloNumeri.substring(0, 2);
            let anno = soloNumeri.substring(2, 4);
            risultato = mese + '/' + anno;
        } else {
            risultato = soloNumeri;
        }

        setScadenza(risultato);
    };

    const salvaCarta = async () => {
        const idUtente = localStorage.getItem('utenteId');
        if (!idUtente) {
            navigazione('/login');
            return;
        }

        try {
            const cartaPulita = numeroCarta.replace(/\s/g, '');
            await axios.post('http://localhost:3001/api/carte', {
                utenteId: idUtente,
                numero: cartaPulita,
                intestatario: intestatario,
                scadenza: scadenza
            });
            navigazione('/dashboard');
        } catch (errore) {
            console.log(errore);
        }
    };

    return (
        <div className={styles.schermataCentrata}>
            <div className={styles.cardAggiungi}>
                <h3 className="mb-4 text-white">Collega una Carta</h3>
                
                <div className="mb-3">
                    <label className="small opacity-75 d-block mb-1 text-white">Numero Carta</label>
                    <input 
                        type="text" 
                        value={numeroCarta} 
                        onChange={gestisciCambioCarta} 
                        placeholder="1234 5678 9012 3456"
                        className={"form-control "}
                    />
                </div>

                <div className="mb-3">
                    <label className="small opacity-75 d-block mb-1 text-white">Intestatario</label>
                    <input 
                        type="text" 
                        value={intestatario} 
                        onChange={(e) => setIntestatario(e.target.value)} 
                        placeholder="Nome e cognome"
                        className={"form-control " + styles.inputCarta}
                    />
                </div>

                <div className="mb-4">
                    <label className="small opacity-75 d-block mb-1 text-white">Scadenza (MM/AA)</label>
                    <input 
                        type="text" 
                        value={scadenza} 
                        onChange={gestisciCambioScadenza} 
                        placeholder="MM/AA"
                        className={"form-control " + styles.inputCarta}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button onClick={salvaCarta} className="btn btn-success fw-bold w-100">Salva</button>
                    <button onClick={() => navigazione('/dashboard')} className="btn btn-outline-light fw-bold w-100">Annulla</button>
                </div>
            </div>
        </div>
    );
};

export default AggiungiCarta;