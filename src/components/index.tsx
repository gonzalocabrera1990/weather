import { Link } from "react-router-dom";
export default function Index() {
    return (
        <div className="index-container" >
            <div className="index-title">
                <h1>
                    Obtene el <br />pronostico<br /> meteorologico<br /> de tu zona
                </h1>
                <button>
                    <Link to={`select-location`}>
                        Ir a la app
                    </Link>
                </button>
            </div>
            <div className="index-img">
                <img src="/weather.svg" alt="" />
            </div>
        </div>
    )
}