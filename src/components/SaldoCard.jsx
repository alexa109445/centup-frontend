
import styles from '../modules/Dashboard.module.css';
const SaldoCard = (props) => {
    return (
        <div className="text-white">
            <p className="mb-2 opacity-75">Saldo Salvadanaio</p>
            <h1 className="fw-bold mb-4 display-5">€ {props.saldo}</h1>
            <button onClick={props.onGeneraSpesa} className={styles.btnGenera}>
    Genera Spesa
</button>

        </div>
    );
};

export default SaldoCard;