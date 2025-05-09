import { useState, useEffect } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CadastroDisciplina() {
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [descricao, setDescricao] = useState('');
    const [professor, setProfessor] = useState('');
    const [professores, setProfessores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/professores/');
                setProfessores(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const token = localStorage.getItem("access");
      
        try {
          await axios.post(
            'http://localhost:8000/api/disciplina/',
            {
              nome,
              curso,
              cargaHoraria,
              descricao,
              professor
            },
            {
              headers: {
                Authorization: `Bearer ${token}`  // <- Aqui está o token
              }
            }
          );
      
          navigate('/conteudo');
        } catch (error) {
          console.error('Erro ao cadastrar disciplina:', error);
        }
      };
      

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2 className={estilos.titulo}>Cadastro Disciplina</h2>

                <input
                    type="text"
                    placeholder="Nome da Disciplina"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={estilos.input}
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
                    placeholder='Descrição'
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className={estilos.input}
                    required
                />
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
                <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Cadastrar Disciplina</button>
                </div>
            </form>
        </div>
    );
}
