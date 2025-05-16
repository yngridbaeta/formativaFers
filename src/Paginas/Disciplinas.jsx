import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";  

export function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access"); 
    console.log(token);
    if (token) {
      axios
        .get("http://localhost:8000/api/disciplina/", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        })
        .then((response) => setDisciplinas(response.data))
        .catch((error) => console.error("Erro ao carregar disciplinas:", error.response || error));
    } else {
      console.log("Token não encontrado.");
    }
  }, []);  

  return (
    <div className="disciplinas-container">
      <h2>Disciplinas</h2>

      <div className="disciplinas-list">
        {disciplinas.map((disciplina) => (
          <div key={disciplina.id} className="disciplina-card">
            <h3>{disciplina.nome}</h3>
            <p>{disciplina.curso}</p>
            <p>{disciplina.cargaHoraria} horas</p>
            <p>{disciplina.descricao}</p>
            <p>{disciplina.professor}</p>
          </div>
        ))}
      </div>
      
      <Link to="/cadastroDisciplina">
        <button className="botao-cadastro">Cadastrar Nova Disciplina</button>
      </Link>
    </div>
  );
}
