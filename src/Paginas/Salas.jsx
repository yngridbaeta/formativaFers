import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmarExclusao from "../Componentes/Confirmarexclusao";
import Lixeira from '../assets/delete.png';
import Lapis from '../assets/pencil.png'
import estilos from './Salas.module.css';
import EditarSala from "../Componentes/EditarSala";

export function Sala() {
  const [Salas, setSalas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controle do modal de edição
  const [itemToDelete, setItemToDelete] = useState(null); // Item selecionado para exclusão
  const [itemToEdit, setItemToEdit] = useState(null); // Item selecionado para edição

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

  const openEditModal = (id, nome) => {
    setItemToEdit({ id, nome });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setItemToDelete(null);
    setItemToEdit(null);
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

  const handleEditConfirm = (updatedSala) => {
    setSalas(Salas.map(sala => sala.id === updatedSala.id ? updatedSala : sala));
    closeModals();
  };

  return (
    <div className={estilos.container}>
    <h2 className={estilos.titulo}>Salas</h2>
  
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%', maxWidth: '900px', marginBottom: '10px' }}>
      <Link to="/cadastroSala">
        <button className={estilos.botaoCadastro}>+ Nova Sala</button>
      </Link>
    </div>
  
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

              <td className={estilos.icone}>
                  <img
                    src={Lapis}
                    alt="Editar"
                    onClick={() => openEditModal(sala.id, sala.nome)}
                    className={estilos.editar}
                  />
                </td>
              
              <td className={estilos.icone}>
                <img
                  src={Lixeira}
                  alt="Excluir"
                  onClick={() => openModal(sala.id, sala.nome)}
                  className={estilos.lixeira}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
      <ConfirmarExclusao
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        itemName={itemToDelete ? itemToDelete.nome : ''}
      /> 
       {/* Modal de edição */}
      <EditarSala
      isOpen={isEditModalOpen}
      onClose={closeModals}
      onConfirm={handleEditConfirm}
      item={itemToEdit}
      />
    </div>

   
  );
}
