import styles from '../modules/Dashboard.module.css';

const SaldoCard = ({ saldo, onGeneraSpesa }) => {
    return (
        <div className="col-12 col-sm-6">
            <div className={styles.cardInfo + " " + styles.cardSaldo}>
                <h3 className={styles.cardLabel}>Saldo Salvadanaio</h3>
                <div>
                    <h2 className={styles.saldoValore}>€ {saldo}</h2>
                    <button 
                        onClick={onGeneraSpesa} 
                        className={styles.btnGenera}
                    >
                        Genera Spesa 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaldoCard;