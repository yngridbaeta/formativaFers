import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmarExclusao from "../Componentes/Confirmarexclusao";
import Lixeira from '../assets/delete.png';
import Lapis from '../assets/pencil.png';
import estilos from './Salas.module.css';

export function Ambiente() {
    const [Ambientes, setAmbientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);

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

    const openModal = (id, nome) => {
        setItemToDelete({id, nome});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const openEditModal = (ambiente) => {
        setItemToEdit(ambiente)
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setItemToDelete(null);
        setItemToEdit(null);
    }

    const confirmDelete = () => {
        const token = localStorage.getItem("access");
        axios
        .delete(`http://localhost:8000/api/ambiente/${itemToDelete.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then(() => {
            setAmbientes(Ambientes.filter(ambiente => ambiente.id !== itemToDelete.id));
            closeModal();
        })
        .catch((error) => console.error("Erro ao excluir ambiente", error.response || error));
    };

    const handleEditConfirm = (updatedambiente) => {
        setAmbientes(Ambientes.map(ambiente => ambiente.id === updatedambiente.id ? updatedambiente : ambiente));
        closeModals();
    }


    return(
        <div className={estilos.container}>
            <h2>Reservas de Ambientes</h2>
       
        
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%', maxWidth: '900px', marginBottom: '10px'}}>
                <Link to="/cadastroAmbiente">
                    <button className={estilos.botaoCadastro}>+ Nova Reserva</button>
                </Link>
            </div>

            <div className={estilos.tableContainer}>
                <table className={estilos.tabela}>
                    <thead>
                        <tr>
                            <th>Início</th>
                            <th>Término</th>
                            <th>Período</th>
                            <th>Sala</th>
                            <th>Professor</th>
                            <th>Disciplina</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Ambientes.map((ambiente) => (
                            <tr key={ambiente.id}>
                                <td>{ambiente.dataInicio}</td>
                                <td>{ambiente.dataTermino}</td>
                                <td>{ambiente.periodo}</td>
                                <td>{ambiente.salaReservada}</td>
                                <td>{ambiente.professor}</td>
                                <td>{ambiente.disciplina}</td>

                                <td className={estilos.icone}>
                                    <img 
                                        src={Lapis}
                                        alt="Editar"
                                        onClick={() => openEditModal(ambiente)}
                                        className={estilos.editar} 
                                    />
                                </td>

                                <td className={estilos.icone}>
                                    <img 
                                        src={Lixeira} 
                                        alt="Excluir"
                                        onClick={() => openModal(ambiente.id, ambiente.nome)}
                                        className={estilos.lixeira} />
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
        </div>
           
    );
}

 {/* <div>
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
        </div> */}