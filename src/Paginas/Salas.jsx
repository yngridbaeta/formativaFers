import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmarExclusao from "../Componentes/Confirmarexclusao";
import Lixeira from '../assets/delete.png';
import estilos from './Salas.module.css';

export function Sala() {
  const [Salas, setSalas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
  const [itemToDelete, setItemToDelete] = useState(null); // Sala a ser deletada

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios
        .get("http://localhost:8000/api/sala/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setSalas(response.data))
        .catch((error) => console.error("Erro ao carregar sala", error.response || error));
    } else {
      console.log("Token não encontrado");
    }
  }, []);

  const openModal = (id, nome) => {
    setItemToDelete({ id, nome });
    setIsModalOpen(true); // Abre o modal de confirmação
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setItemToDelete(null); // Limpa o item
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("access");
    axios
      .delete(`http://localhost:8000/api/sala/${itemToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setSalas(Salas.filter(sala => sala.id !== itemToDelete.id));
        closeModal();
      })
      .catch((error) => console.error("Erro ao excluir sala", error.response || error));
  };

  return (
    <div className={estilos.container}>
      <h2 className={estilos.titulo}>Reservas de Salas</h2>

      <div className={estilos.tableContainer}>
        <table className={estilos.tabela}>
          <thead>
            <tr>
              <th>Nome da Sala</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {Salas.map((sala) => (
              <tr key={sala.id}>
                <td>{sala.nome}</td>
                <td>

                </td>
                <td>
                  <img
                    src={Lixeira}
                    alt="Excluir"
                    onClick={() => openModal(sala.id, sala.nome)} // Abre o modal ao clicar
                    className={estilos.lixeira}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/cadastroSala">
        <button className={estilos.botaoCadastro}>Cadastrar Sala</button>
      </Link>

      <ConfirmarExclusao
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        itemName={itemToDelete ? itemToDelete.nome : ''}
      />
    </div>
  );
}
