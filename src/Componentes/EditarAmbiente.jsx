import React, {useState, useEffect, use} from "react";
import axios from "axios";
import estilos from './EditarSala.module.css'

const EditarAmbiente = ({ isOpen, onClose, onConfirm, item }) => {
    const [dataInicio, setDataInicio] = useState(item?.dataInicio ?? '');
    const [dataTermino, setDataTermino] = useState(item?.dataTermino ?? '');
    const [periodo, setPeriodo] = useState(item?.periodo ?? '');
    const [sala, setSala] = useState(item?.sala ?? '');
    const [professor, setProfessor] = useState(item?.professor ?? '');
    const [disciplina, setDisciplina] = useState(item?.disciplina ?? '');
    
    const [salas, setSalas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    useEffect(() => {
        if(isOpen && item) {
            setDataInicio(item.dataInicio ?? '');
            setDataTermino(item.dataTermino ?? '');
            setPeriodo(item.periodo ?? '');
            
            if (typeof item.sala === 'string') {
                const sala = salas.find(s => s.nome === item.sala); 
                setSala(sala ? sala.id.toString() : ''); 
            } else {
                setSala(item.sala?.id?.toString() ?? '');
            }

            if (typeof item.disciplina === 'string') {
                const disciplina = disciplinas.find(d => d.nome === item.disciplina); 
                setDisciplina(disciplina ? disciplina.id.toString() : '');
            } else {
                setDisciplina(item.disciplina?.id?.toString() ?? '');
            }

            if (typeof item.professor === 'string') {
                const professor = professores.find(p => p.username === item.professor); // Encontramos o professor pelo nome
                setProfessor(professor ? professor.id.toString() : ''); // Setamos o ID do professor no estado
            } else {
                setProfessor(item.professor?.id?.toString() ?? '');
            }
        }
    }, [isOpen, item, salas, disciplinas, professores]);

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
        const token = localStorage.getStorage.getItem("access");

        axios.put(
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
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            onConfirm(response.data);
            onClose();
        })
        .catch((error) => console.error('Erro ao editar disciplina', error.response || error));
    };

    if(!isOpen) return null;

    return(
        <div className={estilos.overlay}>
            <div className={estilos.modal}>
                <h3>Editar Reserva</h3>
                
            </div>

        </div>
    )
}