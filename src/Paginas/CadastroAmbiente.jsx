import { useState, useEffect } from "react";
import estilos from './Cadastros.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Aviso from "../Componentes/Aviso";

export function CadastroAmbiente() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [salaReservada, setSalaReservada] = useState('');
    const [professor, setProfessor] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [erroModalAberto, setErroModalAberto] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');
    const [professores, setProfessores] = useState([]);
    const [salas, setSalas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [isSalaReservada, setIsSalaReservada] = useState(false); 
    const navigate = useNavigate();
    const disciplinasFiltradas = disciplinas.filter(d => d.professor === Number(professor));

    const verificarReserva = async () => {
        if (salaReservada && dataInicio && dataTermino && periodo) {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/ambiente/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const isDataValida = new Date(dataInicio) < new Date(dataTermino);
    
                if (!isDataValida) {
                    setMensagemErro("A data de início não pode ser posterior à data de término.");
                    setErroModalAberto(true);
                    return;
                }
    
                const salaReservadaNoPeriodo = response.data.some(reserva => 
                    reserva.salaReservada === parseInt(salaReservada) &&
                    (
                        (new Date(dataInicio).toDateString() === new Date(reserva.dataInicio).toDateString()) && 
                        reserva.periodo === periodo
                    )
                );
    
                setIsSalaReservada(salaReservadaNoPeriodo); 
            } catch (error) {
                console.error('Erro ao verificar reserva de sala:', error);
            }
        }
    };
    
    

    useEffect(() => {
        verificarReserva();
    }, [salaReservada, dataInicio, dataTermino, periodo]); 

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

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/sala/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas', error);
            }
        };
        fetchSalas();
    }, []);

    useEffect(() => {
        const fetchDisciplinas = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get('http://127.0.0.1:8000/api/disciplina/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDisciplinas(response.data);
            } catch (error) {
                console.error('Erro ao buscar disciplinas', error);
            }
        };
        fetchDisciplinas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access");

        try {
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
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate('/ambientes');
        } catch (error) {
            const msg = 
                error.response?.data?.erro ||
                error.response?.data?.detail ||
                "Erro ao cadastrar reserva.";
            setMensagemErro(msg);
            setErroModalAberto(true);
        }
    };

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2>Reserva de Ambiente</h2>

                <label className={estilos.periodoLabel}>Selecione o dia de inicio</label>
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className={estilos.input}
                    required
                />

                <label className={estilos.periodoLabel}>Selecione o dia de fim</label>
                <input
                    type="date"
                    value={dataTermino}
                    onChange={(e) => setDataTermino(e.target.value)}
                    className={estilos.input}
                    required
                />

                <select
                    value={salaReservada}
                    onChange={(e) => setSalaReservada(e.target.value)}
                    className={estilos.input}
                    required
                >
                    <option value="">Selecione uma sala</option>
                    {salas.map((s) => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                </select>

                
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
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    className={estilos.input}
                    required
                >
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
                    {disciplinasFiltradas.map((d) => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                </select>

                <div className={estilos.divBotao}>
                    <button
                        type="submit"
                        className={`${estilos.botao} ${isSalaReservada ? estilos.botaoIndisponivel : ''}`}
                        disabled={isSalaReservada}>
                        Reservar Ambiente
                    </button>
                </div>
            </form>

            <Aviso
                isOpen={erroModalAberto}
                onClose={() => setErroModalAberto(false)}
                titulo="Erro ao reservar ambiente"
                mensagem={mensagemErro}
            />
        </div>
    );
}
