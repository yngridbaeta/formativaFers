import React, { useState, useEffect } from "react";
import axios from "axios";
import estilos from './EditarSala.module.css';

const EditarDisciplina = ({ isOpen, onClose, onConfirm, item }) => {
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [descricao, setDescricao] = useState('');
    const [professor, setProfessor] = useState('');
    const [professores, setProfessores] = useState([]);

    // Carrega os dados da disciplina e o professor atual
    useEffect(() => {
        if (isOpen && item) {
            setNome(item.nome ?? '');
            setCurso(item.curso ?? '');
            setCargaHoraria(item.cargaHoraria ?? '');
            setDescricao(item.descricao ?? '');
            setProfessor(item.professor?.toString() ?? ''); // item.professor é ID
        }
    }, [isOpen, item]);

    // Carrega a lista de professores
    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/funcionario/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const professoresFiltrados = response.data.filter(p => p.categoria === 'P');
                setProfessores(professoresFiltrados);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        if (isOpen) {
            fetchProfessores();
        }
    }, [isOpen]);

    // Submissão do formulário
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
                professor: parseInt(professor)
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
        .catch((error) => {
            console.error('Erro ao editar disciplina', error.response || error);
        });
    };

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
                        
                        <label htmlFor="curso">Nome do Curso</label>
                        <input
                            type="text"
                            placeholder="Curso"
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                            className={estilos.input}
                            required
                        />

                        <label htmlFor="cargaHoraria">Carga Horária</label>
                        <input
                            type="number"
                            placeholder="Carga Horária"
                            value={cargaHoraria}
                            onChange={(e) => setCargaHoraria(e.target.value)}
                            className={estilos.input}
                            required
                        />
                        <label htmlFor="descrição">Descrição</label>
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className={estilos.input}
                            required
                        />

                        <label htmlFor="professor">Professor</label>
                        <select
                            value={professor}
                            onChange={(e) => setProfessor(e.target.value)}
                            className={estilos.input}
                            required
                        >
                            <option value="">Selecione um professor</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id.toString()}>
                                    {p.nome}
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
