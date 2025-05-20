import React, { useState, useEffect } from "react";
import axios from "axios";
import estilos from './EditarSala.module.css';

const EditarDisciplina = ({ isOpen, onClose, onConfirm, item }) => {
    const [nome, setNome] = useState(item?.nome ?? '');
    const [curso, setCurso] = useState(item?.curso ?? '');
    const [cargaHoraria, setCargaHoraria] = useState(item?.cargaHoraria ?? '');
    const [descricao, setDescricao] = useState(item?.descricao ?? '');
    const [professor, setProfessor] = useState(''); // Aqui inicia com vazio
    const [professores, setProfessores] = useState([]);

    // Quando o modal é aberto, atualizar os valores
    useEffect(() => {
        if (isOpen && item) {
            setNome(item.nome ?? '');
            setCurso(item.curso ?? '');
            setCargaHoraria(item.cargaHoraria ?? '');
            setDescricao(item.descricao ?? '');
            
            // Se o professor é uma string (nome), buscamos o ID correspondente
            if (typeof item.professor === 'string') {
                const professor = professores.find(p => p.username === item.professor); // Encontramos o professor pelo nome
                setProfessor(professor ? professor.id.toString() : ''); // Setamos o ID do professor no estado
            } else {
                // Se já é um objeto com ID, usamos o ID diretamente
                setProfessor(item.professor?.id?.toString() ?? '');
            }
        }
    }, [isOpen, item, professores]); // Certifique-se que os professores estão carregados

    // Carregar a lista de professores
    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/funcionario/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const professoresFiltrados = response.data.filter(prof => prof.categoria === 'P');
                setProfessores(professoresFiltrados);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    // Lidar com a submissão do formulário de edição
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");

        axios.put(
            `http://localhost:8000/api/disciplina/${item.id}`,
            {
                nome,
                curso,
                cargaHoraria: parseInt(cargaHoraria),
                descricao,
                professor: parseInt(professor) // Certifique-se de que o valor é numérico
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        .then((response) => {
            console.log("Resposta do backend:", response.data);

            onConfirm(response.data);
            onClose();
        })
        .catch((error) => console.error('Erro ao editar disciplina', error.response || error));
    };

    // Fechar o modal se não estiver aberto
    if (!isOpen) return null;

    return (
        <div className={estilos.overlay}>
            <div className={estilos.modal}>
                <h3>Editar Disciplina</h3>
                <form onSubmit={handleSubmit}>
                    <div className={estilos.formGroup}>
                        <label htmlFor="nome">Nome da Disciplina</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Curso"
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                            className={estilos.input}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Carga Horária"
                            value={cargaHoraria}
                            onChange={(e) => setCargaHoraria(e.target.value)}
                            className={estilos.input}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className={estilos.input}
                            required
                        />
                        <select
                            value={professor}
                            onChange={(e) => {
                                console.log("Novo professor selecionado:", e.target.value);
                                setProfessor(e.target.value);
                            }}
                            className={estilos.input}
                            required
                            >

                            <option value="">Selecione um professor</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id.toString()}>
                                    {p.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={estilos.buttons}>
                        <button type="button" className={estilos.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={estilos.confirmButton}>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarDisciplina;