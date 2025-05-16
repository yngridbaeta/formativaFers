import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function Professores(){
    const [professores, setProfessores] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access");
        console.log(token);
        if(token) {
            axios
                .get(`http://localhost:8000/api/funcionario/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("Dados recebidos:", response.data);
                    setProfessores(response.data)
                })
                .catch((error) => console.error("Erro ao carregar professor", error.response || error));
        } else {
            console.log("Token não encontrado.");
        }
    }, []); 

     const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("pt-BR", options);
    } ;

    return (
        <div className="professores-container">
            <h2>Professores</h2>

            <div className="professores-list">
                {professores.length > 0 ? (
                    professores
                        .filter((professor) => professor.categoria === "P") // Filtra para mostrar apenas Professores
                        .map((professor, index) => {
                            console.log("Professor ID:", professor.id);
                            return (
                                <div key={professor.id ?? `fallback-${index}`} className="professor-card">
                                    <h3>Nome: {professor.username}</h3>
                                    <h3>Registro: {professor.ni}</h3>
                                    <h3>Email: {professor.email}</h3>
                                    <h3>Telefone: {professor.telefone}</h3>
                                    <h3>Data de nascimento: {formatDate(professor.dataNascimento)}</h3>
                                    <h3>Data de contratação: {formatDate(professor.dataContratacao)}</h3>
                                </div>
                            );
                        })
                ) : (
                    <p>Carregando dados...</p> // Mensagem de carregamento enquanto os dados não são carregados
                )}
            </div>
            <Link to="/cadastroProfessor">
                <button className="botao-cadastro">Cadastrar professor</button>
            </Link>
        </div>
    );
}