import { useState, useEffect } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CadastroSala() {
    const [salas, setsalas] = useState([]);  // Atualizando a lista de salas
    const [nome, setNome] = useState('');    // Estado para o nome da sala
    const navigate = useNavigate();

    useEffect(() => {
        const fetchsalas = async () => {
            try {
                const token = localStorage.getItem("access");

                const response = await axios.get('http://127.0.0.1:8000/api/sala/', {
                    headers: {
                        Authorization: `Bearer ${token}` // Passando o token no header
                    }
                });

                // Atualizando a lista de salas com os dados da resposta
                setsalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
            }
        };

        fetchsalas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access");

        try {
            // Enviando os dados para criar a sala
            await axios.post(
                'http://localhost:8000/api/sala/',
                { nome },  // Enviando o nome da sala
                {
                    headers: {
                        Authorization: `Bearer ${token}`  // Passando o token no header
                    }
                }
            );

            // Navegando para outra página após o cadastro
            navigate('/salas');
        } catch (error) {
            console.error('Erro ao cadastrar Sala:', error);
        }
    };

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2 className={estilos.titulo}>Cadastro Sala</h2>

                <input
                    type="text"
                    placeholder="Nome da Sala"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}  // Atualizando o estado nome
                    className={estilos.input}
                    required
                />

                <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Cadastrar Sala</button>
                </div>
            </form>
        </div>
    );
}
