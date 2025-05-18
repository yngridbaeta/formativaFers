import React, { useState, useEffect } from "react";
import axios from "axios";
import estilos from './EditarSala.module.css';

const EditarAmbiente = ({ isOpen, onClose, onConfirm, item }) => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [salaReservada, setSala] = useState('');
    const [professor, setProfessor] = useState('');
    const [disciplina, setDisciplina] = useState('');

    const [salas, setSalas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    const periodosDisponiveis = [
        { id: 'Manhã', nome: 'Manhã' },
        { id: 'Tarde', nome: 'Tarde' },
        { id: 'Noite', nome: 'Noite' },
    ];

    useEffect(() => {
        if (isOpen && item) {
            setDataInicio(item.dataInicio ?? '');
            setDataTermino(item.dataTermino ?? '');
            setPeriodo(item.periodo ?? '');

            if (typeof item.disciplina === 'string') {
                const disciplinaObj = disciplinas.find(d => d.nome === item.disciplina);
                setDisciplina(disciplinaObj ? disciplinaObj.id.toString() : '');
            } else {
                setDisciplina(item.disciplina?.id?.toString() ?? '');
            }

            if (typeof item.professor === 'string') {
                const prof = professores.find(p => p.username === item.professor);
                setProfessor(prof ? prof.id.toString() : '');
            } else {
                setProfessor(item.professor?.id?.toString() ?? '');
            }
        }
    }, [isOpen, item, disciplinas, professores]);

    useEffect(() => {
        if (isOpen && item && salas.length > 0) {
            if (typeof item.salaReservada === 'string') {
                const sala = salas.find(s => s.nome === item.salaReservada);
                setSala(sala ? sala.id.toString() : '');
            } else {
                setSala(item.salaReservada?.id?.toString() ?? '');
            }
        }
    }, [isOpen, item, salas]);

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/funcionario/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const professoresFiltrados = response.data.filter(p => p.categoria === 'P');
                setProfessores(professoresFiltrados);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/sala/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
            }
        };

        fetchSalas();
    }, []);

    useEffect(() => {
        const fetchDisciplinas = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/disciplina/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDisciplinas(response.data);
            } catch (error) {
                console.error('Erro ao buscar disciplinas:', error);
            }
        };

        fetchDisciplinas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");

        try {
            const response = await axios.put(
                `http://localhost:8000/api/ambiente/${item.id}`,
                {
                    dataInicio,
                    dataTermino,
                    periodo,
                    salaReservada,
                    professor,
                    disciplina
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            onConfirm(response.data);
            onClose();
        } catch (error) {
            console.error('Erro ao editar ambiente', error.response || error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={estilos.overlay}>
            <div className={estilos.modal}>
                <h3>Editar Reserva</h3>
                <form onSubmit={handleSubmit}>
                    <div className={estilos.formGroup}>
                        <label htmlFor="dataInicio">Data de Início:</label>
                        <input
                            id="dataInicio"
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            required
                        />

                        <label htmlFor="dataTermino">Data de Término:</label>
                        <input
                            id="dataTermino"
                            type="date"
                            value={dataTermino}
                            onChange={(e) => setDataTermino(e.target.value)}
                            required
                        />

                        <label htmlFor="periodo">Período:</label>
                        <select
                            id="periodo"
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className={estilos.input}
                            required
                        >
                            <option value="">Selecione um período</option>
                            {periodosDisponiveis.map((p) => (
                                <option key={p.id} value={p.nome}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="sala">Sala:</label>
                        <select
                            id="sala"
                            value={salaReservada}
                            onChange={(e) => setSala(e.target.value)}
                            className={estilos.input}
                            required
                        >
                            <option value="">Selecione uma sala</option>
                            {salas.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nome}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="professor">Professor:</label>
                        <select
                            id="professor"
                            value={professor}
                            onChange={(e) => setProfessor(e.target.value)}
                            className={estilos.input}
                            required
                        >
                            <option value="">Selecione um professor</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.username}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="disciplina">Disciplina:</label>
                        <select
                            id="disciplina"
                            value={disciplina}
                            onChange={(e) => setDisciplina(e.target.value)}
                            className={estilos.input}
                            required
                        >
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={estilos.botoes}>
                        <button type="submit" className={estilos.salvar}>
                            Salvar
                        </button>
                        <button type="button" onClick={onClose} className={estilos.cancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarAmbiente;
