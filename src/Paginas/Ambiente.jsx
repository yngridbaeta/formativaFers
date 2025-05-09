import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function Ambiente() {
    const [ambientes, setAmbientes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if(token) {
            axios  
            .get("http://localhost:8000/api/ambiente/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => setAmbientes(response.data))
            .catch((error) => console.error("Erro ao carregar ambiente", error.response || error)); 
        } else {
            console.log("token não encontrado")
        }
    }, []);

    return(
        <div>
            <h2>Reservas de Ambientes</h2>

            <div>
                {ambientes.map((ambientes) => (
                    <div key={ambientes.id}>
                        <h3>{ambientes.nome}</h3>
                        <p>{ambientes.dataInicio}</p>
                        <p>{ambientes.dataTermino}</p>
                        <p>{ambientes.periodo}</p>
                        <p>{ambientes.salaReservada}</p>
                        <p>{ambientes.professor}</p>
                        <p>{ambientes.disciplina}</p>
                    </div>
                    ))}
            </div>

            <Link to="/cadastroAmbiente">
                <button className="botao-cadastro"> Cadastrar Nova Reserva </button>
            </Link>
        </div>
    )
}