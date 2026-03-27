import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../modules/Dashboard.module.css';
import Header from '../components/Header';
import SaldoCard from '../components/SaldoCard';
import CarteCard from '../components/CarteCard';
import ObiettivoCard from '../components/ObiettivoCard';

const Dashboard = () => {
    const [utenteCorrente, setUtenteCorrente] = useState(null);
    const [listaCarte, setListaCarte] = useState([]);
    const [messaggioErrore, setMessaggioErrore] = useState('');
    
    const [valoreObiettivo, setValoreObiettivo] = useState(100);
    const [nomeObiettivo, setNomeObiettivo] = useState('Risparmio Generico');
    const [iconaSelezionata, setIconaSelezionata] = useState('bi-piggy-bank-fill');
    
    const [idCartaVisibile, setIdCartaVisibile] = useState(null);
    const [mostraInputEstensione, setMostraInputEstensione] = useState(false);
    const [selettoreTrasferimentoAttivo, setSelettoreTrasferimentoAttivo] = useState(false);
    const [selettoreDonazioneAttivo, setSelettoreDonazioneAttivo] = useState(false);
    const [nascondiRaggiungimento, setNascondiRaggiungimento] = useState(false);

    const [messaggioSpesa, setMessaggioSpesa] = useState('');

    const navigazione = useNavigate();

    const recuperaDatiDalServer = async () => {
        const idUtenteInSessione = localStorage.getItem('utenteId');
        try {
            const rispostaUtente = await axios.get('http://localhost:3001/api/utenti/' + idUtenteInSessione);
            const datiUtente = rispostaUtente.data;
            setUtenteCorrente(datiUtente);
            
            if (datiUtente.obiettivoValore !== null) setValoreObiettivo(datiUtente.obiettivoValore);
            if (datiUtente.obiettivoNome !== null) setNomeObiettivo(datiUtente.obiettivoNome);
            if (datiUtente.obiettivoIcona !== null) setIconaSelezionata(datiUtente.obiettivoIcona);

            const rispostaCarte = await axios.get('http://localhost:3001/api/carte/utente/' + idUtenteInSessione);
            setListaCarte(rispostaCarte.data);
        } catch (errore) {
            setMessaggioErrore('Errore nel caricamento dei dati.');
        }
    };

    useEffect(() => {
        const idUtenteInSessione = localStorage.getItem('utenteId');
        if (!idUtenteInSessione) {
            navigazione('/login');
            return;
        }
        recuperaDatiDalServer();
    }, [navigazione]);

    const generaSpesaSimulata = async () => {
        if (listaCarte.length === 0) {
            alert("Aggiungi una carta!");
            return;
        }
        const importoCasuale = parseFloat((Math.random() * 20 + 1).toFixed(2));
        const arrotondamentoCalcolato = parseFloat((Math.ceil(importoCasuale) - importoCasuale).toFixed(2));
        const saldoPrecedente = parseFloat(utenteCorrente.saldoSalvadanaio) || 0;
        const nuovoSaldoAggiornato = (saldoPrecedente + arrotondamentoCalcolato).toFixed(2);

        let testo = "Hai speso " + importoCasuale.toFixed(2) + " € ed hai risparmiato " + arrotondamentoCalcolato.toFixed(2) + " €";
        setMessaggioSpesa(testo);

        try {
            await axios.put('http://localhost:3001/api/utenti/' + utenteCorrente.id + '/saldo?nuovoSaldo=' + nuovoSaldoAggiornato);
            setNascondiRaggiungimento(false);
            recuperaDatiDalServer();
        } catch (errore) {
            alert("Errore nel salvataggio.");
        }
    };

    const confermaTrasferimentoSuCarta = async (numeroDellaCarta) => {
        try {
            await axios.put('http://localhost:3001/api/utenti/' + utenteCorrente.id + '/saldo?nuovoSaldo=0.00');
            setUtenteCorrente({ ...utenteCorrente, saldoSalvadanaio: "0.00" });
            setSelettoreTrasferimentoAttivo(false);
            setMostraInputEstensione(false);
            alert('Hai trasferito con successo i fondi sulla carta: ' + numeroDellaCarta);
            recuperaDatiDalServer();
        } catch (errore) {
            alert("Errore durante il trasferimento.");
        }
    };

    const confermaDonazioneBenefica = async (idEnte, nomeEnte) => {
        try {
            await axios.post('http://localhost:3001/api/donazioni/svuota/' + utenteCorrente.id + '/' + idEnte);
            setUtenteCorrente({ ...utenteCorrente, saldoSalvadanaio: "0.00" });
            setSelettoreDonazioneAttivo(false);
            setMostraInputEstensione(false);
            alert('Hai donato con successo a: ' + nomeEnte);
            recuperaDatiDalServer();
        } catch (errore) {
            alert("Errore durante la donazione.");
        }
    };

    const eliminaCartaDalDatabase = async (evento, idCartaDaEliminare) => {
        evento.stopPropagation();
        if (window.confirm("Eliminare questa carta?")) {
            try {
                await axios.delete('http://localhost:3001/api/carte/' + idCartaDaEliminare);
                recuperaDatiDalServer();
            } catch (errore) {
                alert("Errore eliminazione.");
            }
        }
    };

    const mostraNascondiNumeroCarta = (idDellaCarta) => {
        if (idCartaVisibile === idDellaCarta) {
            setIdCartaVisibile(null);
        } else {
            setIdCartaVisibile(idDellaCarta);
        }
    };

    const salvaNuovoObiettivo = async () => {
        const idUtenteInSessione = localStorage.getItem("utenteId");
        const datiDaInviare = {
            obiettivoValore: parseFloat(valoreObiettivo),
            obiettivoNome: nomeObiettivo,
            obiettivoIcona: iconaSelezionata
        };
        try {
            await axios.put('http://localhost:3001/api/utenti/' + idUtenteInSessione + '/obiettivo', datiDaInviare);
            setMostraInputEstensione(false);
            setNascondiRaggiungimento(false);
            alert("Obiettivo aggiornato!");
            recuperaDatiDalServer();
        } catch (errore) {
            alert("Errore salvataggio obiettivo.");
        }
    };

    const effettuaLogout = () => {
        if (window.confirm("Sei sicuro di voler uscire?")) {
            localStorage.clear();
            navigazione('/login');
        }
    };

    const iconeDisponibili = [
        { id: 1, classeCss: 'bi-car-front-fill' },
        { id: 2, classeCss: 'bi-house-heart-fill' },
        { id: 3, classeCss: 'bi-airplane-engines-fill' },
        { id: 4, classeCss: 'bi-gift-fill' },
        { id: 5, classeCss: 'bi-laptop-fill' },
        { id: 6, classeCss: 'bi-piggy-bank-fill' }
    ];

    const listaEntiBenefici = [
        { id: 1, nome: 'Greenpeace' },
        { id: 2, nome: 'Croce Rossa' },
        { id: 3, nome: 'Save the Children' }
    ];

    if (!utenteCorrente) {
        return <div className="text-center mt-5 text-white">Caricamento in corso...</div>;
    }

    const risparmioReale = parseFloat(utenteCorrente.saldoSalvadanaio);

    let bloccoRiscontro = null;
    if (messaggioSpesa !== "") {
        bloccoRiscontro = (
            <div className="row mb-3">
                <div className="col-12">
                    <div className="p-3 bg-dark bg-opacity-25 border border-success rounded text-center text-white fw-bold">
                        {messaggioSpesa}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"container-fluid px-3 px-md-5 mt-4 mb-5 "}>
            <Header nomeUtente={utenteCorrente.nome} onLogout={effettuaLogout} />
            
            {bloccoRiscontro}

            <div className="row justify-content-between g-4 mb-5">
                <div className="col-12 col-md-5">
                    <SaldoCard 
                        saldo={utenteCorrente.saldoSalvadanaio} 
                        onGeneraSpesa={generaSpesaSimulata} 
                    />
                </div>

                <div className="col-12 col-md-6">
                    <CarteCard 
                        listaCarte={listaCarte} 
                        onAggiungi={() => navigazione('/aggiungi-carta')} 
                        idCartaVisibile={idCartaVisibile} 
                        onMostraNascondi={mostraNascondiNumeroCarta} 
                        onElimina={eliminaCartaDalDatabase} 
                    />
                </div>
            </div>


            <ObiettivoCard 
                risparmioReale={risparmioReale}
                valoreObiettivo={valoreObiettivo} setValoreObiettivo={setValoreObiettivo}
                nomeObiettivo={nomeObiettivo} setNomeObiettivo={setNomeObiettivo}
                iconaSelezionata={iconaSelezionata} setIconaSelezionata={setIconaSelezionata}
                mostraInputEstensione={mostraInputEstensione} setMostraInputEstensione={setMostraInputEstensione}
                selettoreTrasferimentoAttivo={selettoreTrasferimentoAttivo} setSelettoreTrasferimentoAttivo={setSelettoreTrasferimentoAttivo}
                selettoreDonazioneAttivo={selettoreDonazioneAttivo} setSelettoreDonazioneAttivo={setSelettoreDonazioneAttivo}
                nascondiRaggiungimento={nascondiRaggiungimento} setNascondiRaggiungimento={setNascondiRaggiungimento}
                onSalvaObiettivo={salvaNuovoObiettivo}
                onTrasferisci={confermaTrasferimentoSuCarta}
                onDona={confermaDonazioneBenefica}
                listaCarte={listaCarte}
                iconeDisponibili={iconeDisponibili}
                listaEntiBenefici={listaEntiBenefici}
            />
        </div>
    );
};

export default Dashboard;