import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import styles from '../modules/Dashboard.module.css';

const ObiettivoCard = (props) => {
    const valoreMax = parseFloat(props.valoreObiettivo) || 1;
    
    let percentuale = Math.floor((props.risparmioReale / valoreMax) * 100);
    if (percentuale > 100) { 
        percentuale = 100; 
    }

    let fettaRisparmiata;
    if (props.risparmioReale > valoreMax) {
        fettaRisparmiata = valoreMax;
    } else {
        fettaRisparmiata = props.risparmioReale;
    }

    let fettaMancante;
    if (valoreMax > props.risparmioReale) {
        fettaMancante = valoreMax - props.risparmioReale;
    } else {
        fettaMancante = 0;
    }

    const dati = [
        { value: fettaRisparmiata },
        { value: fettaMancante }
    ];

    const colori = ['#7d4fe2ff', '#382c64ff'];

    let bloccoComandi;

    if (props.selettoreTrasferimentoAttivo === true) {
        bloccoComandi = (
            <div className="p-3 border border-primary rounded text-center">
                <h5 className="mb-3 text-white">Scegli carta:</h5>
                {props.listaCarte.map(function(c) {
                    const numeroTesto = c.numero.toString();
                    const finale = numeroTesto.substring(numeroTesto.length - 4);
                    return (
                        <button key={c.id} onClick={() => props.onTrasferisci(c.numero)} className="btn btn-dark w-100 mb-2 text-start">
                            **** {finale}
                        </button>
                    );
                })}
                <button onClick={() => props.setSelettoreTrasferimentoAttivo(false)} className="btn btn-link text-white w-100">Annulla</button>
            </div>
        );
    } 
    else if (props.selettoreDonazioneAttivo === true) {
        bloccoComandi = (
            <div className="p-3 border border-danger rounded text-center">
                <h5 className="mb-3 text-white">Scegli ente:</h5>
                {props.listaEntiBenefici.map(function(ente) {
                    return (
                        <button key={ente.id} onClick={() => props.onDona(ente.id, ente.nome)} className="btn btn-dark w-100 mb-2 text-start">
                            {ente.nome}
                        </button>
                    );
                })}
                <button onClick={() => props.setSelettoreDonazioneAttivo(false)} className="btn btn-link text-white w-100">Annulla</button>
            </div>
        );
    }
    else if (props.mostraInputEstensione === true) {
        bloccoComandi = (
            <div>
                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <label className="small text-white d-block mb-1">Nuova Cifra (€)</label>
                        <input 
                            type="number" 
                            value={props.valoreObiettivo} 
                            onChange={(e) => props.setValoreObiettivo(e.target.value)} 
                            className={"form-control " + styles.inputPersonalizzato} 
                        />
                    </div>
                </div>
                <button onClick={props.onSalvaObiettivo} className={styles.btnSalva + " mb-3"}>
                    Conferma Estensione
                </button>
                <button onClick={() => props.setMostraInputEstensione(false)} className="btn btn-link text-white w-100">
                    Annulla
                </button>
            </div>
        );
    }
    else if (percentuale >= 100 && props.nascondiRaggiungimento === false) {
        bloccoComandi = (
            <div className="p-3 border border-success rounded text-center">
                <h4 className="text-success">Obiettivo raggiunto!</h4>
                <div className="row g-2 mt-3">
    <div className="col-12 col-sm-4">
        <button 
            onClick={() => props.setMostraInputEstensione(true)} 
            className="btn btn-warning fw-bold w-100"
        >
            Estendi
        </button>
    </div>
    <div className="col-12 col-sm-4">
        <button 
            onClick={() => props.setSelettoreTrasferimentoAttivo(true)} 
            className="btn btn-primary fw-semibold w-100"
        >
            Trasferisci
        </button>
    </div>
    <div className="col-12 col-sm-4">
        <button 
            onClick={() => props.setSelettoreDonazioneAttivo(true)} 
            className="btn btn-info fw-semibold w-100"
        >
            Dona
        </button>
    </div>
</div>
</div>
        );
    }
    else {
        bloccoComandi = (
            <div>
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-5">
                        <label className="small text-white d-block mb-1">Cifra (€)</label>
                        <input 
                            type="number" 
                            value={props.valoreObiettivo} 
                            onChange={(e) => props.setValoreObiettivo(e.target.value)} 
                            className={"form-control " + styles.inputPersonalizzato} 
                        />
                    </div>
                    <div className="col-12 col-sm-7">
                        <label className="small text-white d-block mb-1">Inserisci obiettivo</label>
                        <input 
                            type="text" 
                            value={props.nomeObiettivo} 
                            onChange={(e) => props.setNomeObiettivo(e.target.value)} 
                            className={"form-control " + styles.inputPersonalizzato} 
                        />
                    </div>
                </div>
                
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                    {props.iconeDisponibili.map(function(icona) {
                        let classeIcona = styles.btnIcona;
                        if (props.iconaSelezionata === icona.classeCss) {
                            classeIcona = styles.btnIcona + " " + styles.btnIconaAttivo;
                        }
                        return (
                            <button 
                                key={icona.id} 
                                onClick={() => props.setIconaSelezionata(icona.classeCss)} 
                                className={classeIcona}
                            >
                                <i className={"bi " + icona.classeCss}></i>
                            </button>
                        );
                    })}
                </div>

                <button onClick={props.onSalvaObiettivo} className={styles.btnSalva + " mb-3"}>
                    Salva Obiettivo
                </button>

                <div className="row g-2 mt-3">
    <div className="col-12 col-sm-4">
        <button onClick={() => props.setMostraInputEstensione(true)} className="btn btn-light fw-semibold w-100">Estendi</button>
    </div>
    <div className="col-12 col-sm-4">
        <button onClick={() => props.setSelettoreTrasferimentoAttivo(true)} className="btn btn-lightfw-semibold w-100">Trasferisci</button>
    </div>
    <div className="col-12 col-sm-4">
        <button onClick={() => props.setSelettoreDonazioneAttivo(true)} className="btn btn-light fw-semibold w-100">Dona</button>
    </div>
</div>
            </div>
        );
    }

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className={styles.cardGrafico}>
                    <div className="text-center mb-2">
                        <i className={"bi " + props.iconaSelezionata} style={{ fontSize: '3rem', color: '#a855f7' }}></i>
                        <p className="fw-bold" style={{ color: '#a855f7', fontSize: '20px' }}>{props.nomeObiettivo}</p>
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={dati} innerRadius={60} outerRadius={90} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                                    {colori.map(function(c, i) {
                                        return <Cell key={i} fill={c} />;
                                    })}
                                    <Label value={percentuale + '%'} position="center" fill="#fff" style={{ fontSize: '24px', fontWeight: 'bold' }} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        {bloccoComandi}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObiettivoCard;