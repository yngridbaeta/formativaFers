import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmarExclusao from "../Componentes/Confirmarexclusao";
import Lixeira from '../assets/delete.png';
import Lapis from '../assets/pencil.png';
import estilos from './Salas.module.css';
import EditarProfessores from "../Componentes/EditarProfessores";

export function Professores() {
    const [Professores, setProfessores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [categoriaUsuario, setCategoriaUsuario] = useState(null);


    // useEffect(() => {
    //     const token = localStorage.getItem("access");
    //     if (token) {
    //         axios.get(`http://localhost:8000/api/funcionario/`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         .then((response) => {
    //             setProfessores(response.data);
    //         })
    //         .catch((error) => console.error("Erro ao carregar professores", error.response || error));
    //     }
    // }, []);

    function parseJwt(token) {
        if (!token) return null;
        try {
          const payload = token.split('.')[1];
          const decoded = atob(payload); 
          return JSON.parse(decoded); 
        } catch (e) {
          console.error("Erro ao decodificar token:", e);
          return null;
        }
      }
      
      useEffect(() => {
        const token = localStorage.getItem("access");
      
        if (token) {
          const decoded = parseJwt(token);
          const userId = decoded?.user_id;
      
          // Carrega as salas
          axios.get("http://localhost:8000/api/funcionario/", {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((response) => setProfessores(response.data))
          .catch((error) => console.error("Erro ao carregar salas", error.response || error));
      
          if (userId) {
            axios.get(`http://localhost:8000/api/funcionario/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setCategoriaUsuario(res.data.categoria))
            .catch((err) => console.error("Erro ao buscar categoria do usuário", err.response || err));
          }
        } else {
          console.log("Token não encontrado");
        }
      }, []);

    const formatDate = (date) => {
        const options = { year: "numeric", month: "numeric", day: "numeric" };
        return new Date(date).toLocaleDateString("pt-BR", options);
    };

    const openModal = (id, nome) => {
        setItemToDelete({ id, nome });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const openEditModal = (professor) => {
        setItemToEdit(professor);
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
        axios.delete(`http://localhost:8000/api/funcionario/${itemToDelete.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            setProfessores(Professores.filter(p => p.id !== itemToDelete.id));
            closeModal();
        })
        .catch((error) => console.error("Erro ao excluir professor", error.response || error));
    };

    const handleEditConfirm = (updatedProfessor) => {
        setProfessores(Professores.map(p => p.id === updatedProfessor.id ? updatedProfessor : p));
        closeModals();
    };

    return (
        <div className={estilos.container}>
            <h2>Professores</h2>

            {categoriaUsuario === 'G' &&
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%', maxWidth: '900px', marginBottom: '10px' }}>
                <Link to="/cadastroProfessor">
                    <button className={estilos.botaoCadastro}>+ Novo Professor</button>
                </Link>
            </div>
            }

            <div className={estilos.tableContainer}>
                <table className={estilos.tabela}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Registro</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Nascimento</th>
                            <th>Contratação</th>
                            {categoriaUsuario === 'G' && <th>Editar</th>}
                            {categoriaUsuario === 'G' && <th>Excluir</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {Professores.length > 0 ? (
                            Professores
                                .filter((prof) => prof.categoria === "P")
                                .map((professor, index) => (
                                    <tr key={professor.id ?? `fallback-${index}`} className="professor-card">
                                        <td>{professor.username}</td>
                                        <td>{professor.ni}</td>
                                        <td>{professor.email}</td>
                                        <td>{professor.telefone}</td>
                                        <td>{formatDate(professor.dataNascimento)}</td>
                                        <td>{formatDate(professor.dataContratacao)}</td>
                                        
                                        {categoriaUsuario === 'G' && ( 
                                            <td className={estilos.icone}>
                                                <img
                                                    src={Lapis}
                                                    alt="Editar"
                                                    onClick={() => openEditModal(professor)}
                                                    className={estilos.editar}
                                                />
                                            </td>
                                        )}

                                        {categoriaUsuario === 'G' && (
                                            <td className={estilos.icone}>
                                                <img
                                                    src={Lixeira}
                                                    alt="Excluir"
                                                    onClick={() => openModal(professor.id, professor.username)}
                                                    className={estilos.lixeira}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>Carregando dados...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmarExclusao
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                itemName={itemToDelete ? itemToDelete.nome : ''}
            />

            <EditarProfessores
                isOpen={isEditModalOpen}
                onClose={closeModals}
                onConfirm={handleEditConfirm}
                item={itemToEdit}
            />
        </div>
    );
}
