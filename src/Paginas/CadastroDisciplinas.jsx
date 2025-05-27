import { useEffect, useState } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export function CadastroDisciplina() {
    const [professores, setProfessores] = useState([]);
    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const token = localStorage.getItem("access");

                const response = await axios.get('http://127.0.0.1:8000/api/funcionario/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const professoresFiltrados = response.data.filter(professor => professor.categoria === 'P');
                setProfessores(professoresFiltrados);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem("access");

        try {
            await axios.post(
                'http://localhost:8000/api/disciplina/',
                {
                    nome: data.nome,
                    curso: data.curso,
                    cargaHoraria: data.cargaHoraria,
                    descricao: data.descricao,
                    professor: data.professor
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            reset();
            navigate('/disciplinas');
        } catch (error) {
            console.error('Erro ao cadastrar disciplina:', error);
        }
    };

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={estilos.titulo}>Cadastro Disciplina</h2>

                <input
                    type="text"
                    placeholder="Nome da Disciplina"
                    {...register('nome', { required: true })}
                    className={estilos.input}
                />
                <input
                    type="text"
                    placeholder="Curso"
                    {...register('curso', { required: true })}
                    className={estilos.input}
                />
                <input
                    type="number"
                    placeholder="Carga Horária"
                    {...register('cargaHoraria', { required: true, valueAsNumber: true })}
                    className={estilos.input}
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    {...register('descricao', { required: true })}
                    className={estilos.input}
                />
                <select
                    {...register('professor', { required: true })}
                    className={estilos.input}
                >
                    <option value="">Selecione um professor</option>
                    {professores.map((p) => (
                        <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                </select>

                <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Cadastrar Disciplina</button>
                </div>
            </form>
        </div>
    );
}
