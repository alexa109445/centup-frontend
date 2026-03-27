import styles from '../modules/Dashboard.module.css';

const CarteCard = (props) => {
    const listaRenderizzata = props.listaCarte.map((carta) => {
        let testoDaMostrare = "";

        if (props.idCartaVisibile === carta.id) {
            if (carta.numero !== undefined) {
                testoDaMostrare = carta.numero;
            } else {
                testoDaMostrare = "**** **** **** " + carta.ultime_quattro_cifre;
            }
        } else {
            let fine = "";
            if (carta.ultime_quattro_cifre !== undefined) {
                fine = carta.ultime_quattro_cifre;
            } else if (carta.numero !== undefined) {
                let n = carta.numero.toString();
                fine = n.slice(-4);
            }
            testoDaMostrare = "**** **** **** " + fine;
        }

        return (
            <div key={carta.id} className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white border-opacity-10">
                <div onClick={() => props.onMostraNascondi(carta.id)} style={{ cursor: 'pointer' }}>
                    <p className="m-0 fw-bold" style={{ fontFamily: 'monospace' }}>
                        {testoDaMostrare}
                    </p>
                    <small className="opacity-50 text-uppercase">{carta.nome_titolare}</small>
                </div>
                <button 
                    onClick={(e) => props.onElimina(e, carta.id)} 
                    className={styles.btnElimina}
                >
                    Elimina
                </button>
            </div>
        );
    });

    let contenutoLista = "";
    if (props.listaCarte.length === 0) {
        contenutoLista = <p className="opacity-50">Nessuna carta presente.</p>;
    } else {
        contenutoLista = <div className="mt-2">{listaRenderizzata}</div>;
    }

    return (
        <div className="text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="m-0 fw-bold">Le tue Carte</h5>
                <button onClick={props.onAggiungi} className={styles.btnAggiungi}>
                    + Aggiungi
                </button>
            </div>
            {contenutoLista}
        </div>
    );
};

export default CarteCard;