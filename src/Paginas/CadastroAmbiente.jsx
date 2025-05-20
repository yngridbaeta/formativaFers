import { useState, useEffect, use } from "react";
import estilos from './Cadastros.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CadastroAmbiente(){
    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [salaReservada, setSalaReservada] = useState('');
    const [professor, setProfessor] = useState('');
    const [disciplina, setDisciplina] = useState('')
    

    const [professores, setProfessores] = useState([]);
    const [salas, setSalas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const token = localStorage.getItem("access");

                const response = await axios.get('http://127.0.0.1:8000/api/funcionario/', {
                    headers: {
                        Authorization: `Bearer ${token}` // Passando o token no header
                    }
                });

                // criando uma variavel para filtrar apenas gestores, e nao professores + gestores
                const professoresFiltrados = response.data.filter(professor => professor.categoria === 'P');

                setProfessores(professoresFiltrados);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    useEffect(() => async () => {
        
        const fetchSalas = async () => {
            try {
                const token = localStorage.getItem("access");

                const response = await axios.get('http://127.0.0.1:8000/api/sala/', {
                    headers: {
                        Authorization: `Bearer ${token}` // Passando o token no header
                    }
                });

                setSalas(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Erro ao buscar salas', error);
            }
        };
        fetchSalas();
    }, [])

    useEffect(() => async () => {
        const fetchDisciplinas = async () => {
            try{
                const token = localStorage.getItem("access");

                const response = await axios.get('http://127.0.0.1:8000/api/disciplina/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDisciplinas(response.data);
                console.log(response.data)
            } catch(error){
                console.error('Erro ao buscar salas', error);
            }
        };
        fetchDisciplinas();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access");

        try{
            await axios.post(
                'http://localhost:8000/api/ambiente/',
                {
                    dataInicio,
                    dataTermino,
                    periodo,
                    salaReservada,
                    professor,
                    disciplina
                },
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        navigate('/ambientes');
        } catch (error){
            console.error('Erro ao cadastrar disciplina', error);
        }
    };

    return(
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2>Reserva de Ambiente</h2>

                <input 
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input
                    type="date"
                    value={dataTermino}
                    onChange={(e) => setDataTermino(e.target.value)}
                    className={estilos.input}
                    required
                />

                <div className={estilos.periodoContainer}>
                    <label className={estilos.periodoLabel}>Selecione o período:</label>
                    <div className={estilos.botoesPeriodo}>
                        {["Manhã", "Tarde", "Noite"].map((opcao) => (
                            <button
                                type="button"
                                key={opcao}
                                className={`${estilos.botaoPeriodo} ${periodo === opcao ? estilos.ativo : ''}`}
                                onClick={() => setPeriodo(opcao)}>
                                {opcao}
                            </button>
                        ))}
                    </div>
                </div>

                <select 
                    value={salaReservada}
                    onChange={(e) => setSalaReservada(e.target.value)}
                    className={estilos.input}
                    required>

                    <option value="">Selecione uma sala</option>
                    {salas.map((s) => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                </select>

                <select
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    className={estilos.input}
                    required>

                    <option value="">Selecione um professor</option>
                    {professores.map((p) => (
                        <option key={p.id} value={p.id}>{p.username}</option>   
                    ))}
                </select>

                <select
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className={estilos.input}
                    required>

                    <option value="">Selecione uma disciplina</option>
                    {disciplinas.map((d) => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                </select>

                <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Reservar Ambiente</button>
                </div>
            </form>

        </div>
    )
}