import styles from '../modules/Dashboard.module.css';

const CarteCard = ({ listaCarte, onAggiungi, idCartaVisibile, onMostraNascondi, onElimina }) => {
    
    function ottieniTestoNumero(carta) {
        if (idCartaVisibile === carta.id) {
            return carta.numero;
        } else {
            const numStr = carta.numero.toString();
            const fine = numStr.substring(numStr.length - 4);
            return "**** " + fine;
        }
    }

    return (
        <div className="col-12 col-sm-6">
            <div className={styles.cardInfo + " " + styles.cardCarte}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={styles.cardLabel + " m-0"}>Le tue Carte</h3>
                    <button onClick={onAggiungi} className={styles.btnAggiungi}>
                        + Aggiungi
                    </button>
                </div>
                <ul className="list-unstyled m-0">
                    {listaCarte.map(function(carta) {
                        return (
                            <li key={carta.id} className="mb-2 border-bottom border-white border-opacity-10 pb-2 d-flex justify-content-between align-items-center">
                                <span onClick={() => onMostraNascondi(carta.id)} style={{ cursor: 'pointer', fontFamily: 'monospace' }}>
                                    {ottieniTestoNumero(carta)}
                                </span>
                                <button onClick={(e) => onElimina(e, carta.id)} className={styles.btnElimina}>
                                    Elimina
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default CarteCard;