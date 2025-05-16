import { useState, useEffect, use } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function Gestores() {
    const [gestores, setGestores] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access");
        console.log(token)
        if (token) {
            axios
                .get(`http://localhost:8000/api/funcionario`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("Dados recebidos:", response.data);
                    setGestores(response.data)
                })
                .catch((error) => console.error("Erro ao carregar gestor", error.response || error));
        } else {
            console.log("Token não encontrado");
        }
    }, [])

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("pt-BR", options);
    };

    return (
        <div className="gestores-container">
            <h2>gestores</h2>

            <div className="gestores-list">
                {gestores.length > 0 ? (
                    gestores
                        .filter((gestor) => gestor.categoria === "G") // Filtra para mostrar apenas gestores
                        .map((gestor, index) => {
                            console.log("gestor ID:", gestor.id);
                            return (
                                <div key={gestor.id ?? `fallback-${index}`} className="gestor-card">
                                    <h3>Nome: {gestor.username}</h3>
                                    <h3>Registro: {gestor.ni}</h3>
                                    <h3>Email: {gestor.email}</h3>
                                    <h3>Telefone: {gestor.telefone}</h3>
                                    <h3>Data de nascimento: {formatDate(gestor.dataNascimento)}</h3>
                                    <h3>Data de contratação: {formatDate(gestor.dataContratacao)}</h3>
                                </div>
                            );
                        })
                ) : (
                    <p>Carregando dados...</p> // Mensagem de carregamento enquanto os dados não são carregados
                )}
            </div>
            <Link to="/cadastrogestor">
                <button className="botao-cadastro">Cadastrar gestor</button>
            </Link>
        </div>
    );
}