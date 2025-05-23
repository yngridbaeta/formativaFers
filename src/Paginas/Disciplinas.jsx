import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";  
import ConfirmarExclusao from "../Componentes/Confirmarexclusao";
import Lixeira from '../assets/delete.png';
import Lapis from '../assets/pencil.png';
import estilos from './Salas.module.css';
import EditarDisciplina from "../Componentes/EditarDisciplina";
import Aviso from "../Componentes/Aviso";  // Importando o modal de erro

export function Disciplinas() {
  const [Disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); 
  const [itemToEdit, setItemToEdit] = useState(null); 
  const [erroModalAberto, setErroModalAberto] = useState(false); // Estado do modal de erro
  const [mensagemErro, setMensagemErro] = useState(''); // Mensagem do erro
  const [categoriaUsuario, setCategoriaUsuario] = useState(null);


  // useEffect(() => {
  //   const token = localStorage.getItem("access"); 
  //   console.log(token);
  //   if (token) {
  //     axios
  //       .get("http://localhost:8000/api/disciplina/", {
  //         headers: {
  //           Authorization: `Bearer ${token}`, 
  //         },
  //       })
  //       .then((response) => setDisciplinas(response.data))
  //       .catch((error) => console.error("Erro ao carregar disciplinas:", error.response || error));
  //   } else {
  //     console.log("Token não encontrado.");
  //   }
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
  
      // Carrega as disciplinas
      axios.get("http://localhost:8000/api/disciplina/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => setDisciplinas(response.data))
      .catch((error) => console.error("Erro ao carregar salas", error.response || error));
  
      if (userId) {
        axios.get("http://localhost:8000/api/funcionario/", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setCategoriaUsuario(res.data[0].categoria);
          } else {
            setCategoriaUsuario(null);
          }
        })
        .catch((err) => console.error("Erro ao buscar categoria do usuário", err.response || err));
      }
    } else {
      console.log("Token não encontrado");
    }
  }, []);

  const openModal = (id, nome) => {
    setItemToDelete({ id, nome });
    setIsModalOpen(true); // Abre o modal de confirmação
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setItemToDelete(null); 
  };

  const openEditModal = (disciplina) => {
    setItemToEdit(disciplina);
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
      .delete(`http://localhost:8000/api/disciplina/${itemToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setDisciplinas(Disciplinas.filter(disciplina => disciplina.id !== itemToDelete.id));
        closeModal();
      })
      .catch((error) => {
        setMensagemErro("Erro ao excluir disciplina.");
        setErroModalAberto(true); 
        console.error("Erro ao excluir disciplina", error.response || error);
      });
  };

  const handleEditConfirm = (updateddisciplina) => {
    setDisciplinas(Disciplinas.map(disciplina => disciplina.id === updateddisciplina.id ? updateddisciplina : disciplina));
    closeModals();
  };

  return (
    <div className={estilos.container}>
      <h2>Disciplinas</h2>

      {categoriaUsuario === 'G' &&
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%', maxWidth: '900px', marginBottom: '10px' }}>
          <Link to="/cadastroDisciplina">
            <button className={estilos.botaoCadastro}>+ Nova Disciplina</button>
          </Link>
        </div>
      }

      <div className={estilos.tableContainer}>
        <table className={estilos.tabela}>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Curso</th>
              <th>Carga Horaria</th>
              <th>Descrição</th>
              <th>Professor</th>
              {categoriaUsuario === 'G' && <th>Editar</th>}
              {categoriaUsuario === 'G' && <th>Excluir</th>}
            </tr>
          </thead>
          <tbody>
            {Disciplinas.map((disciplina) => (
              <tr key={disciplina.id}>
                <td>{disciplina.nome}</td>
                <td>{disciplina.curso}</td>
                <td>{disciplina.cargaHoraria} horas</td>
                <td>{disciplina.descricao}</td>
                <td>{disciplina.professor_nome}</td> 

                {categoriaUsuario === 'G' && (
                  <td className={estilos.icone}>
                    <img
                      src={Lapis}
                      alt="Editar"
                      onClick={() => openEditModal(disciplina)} 
                      className={estilos.editar}
                    />
                  </td>
                )}
                
                {categoriaUsuario === 'G' && (
                  <td className={estilos.icone}>
                    <img
                      src={Lixeira}
                      alt="Excluir"
                      onClick={() => openModal(disciplina.id, disciplina.nome)}
                      className={estilos.lixeira}
                    />
                  </td>
                )}
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

      <EditarDisciplina
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onConfirm={handleEditConfirm}
        item={itemToEdit}
      />

      <Aviso
        isOpen={erroModalAberto}
        onClose={() => setErroModalAberto(false)}
        titulo="Erro"
        mensagem={mensagemErro}
      />
    </div>
  );
}
