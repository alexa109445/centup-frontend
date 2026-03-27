const Header = (props) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
            <h2 className="m-0 text-white">Ciao, {props.nomeUtente}!</h2>
            <button onClick={props.onLogout} className="btn btn-outline-danger fw-bold">
                Esci
            </button>
        </div>
    );
};

export default Header;