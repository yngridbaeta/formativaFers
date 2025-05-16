import { useState } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CadastroGestor() {
    const [nome, setNome] = useState('');
    const [ni, setNi] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataContratacao, setDataContratacao] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("access");
      
        try {
            await axios.post(
                'http://localhost:8000/api/funcionario/',
                {
                    username,
                    password,
                    nome,
                    ni,
                    categoria: 'G',
                    email,
                    telefone,
                    dataNascimento,
                    dataContratacao
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            navigate('/conteudo');
        } catch (error) {
            console.error('Erro ao cadastrar Gestor', error);
        }
    };
    

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2 className={estilos.titulo}>Cadastro de Gestor</h2>

                <input 
                    type="text"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="text"
                    placeholder="Nome do Gestor"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="number"
                    placeholder="Número de Identificação"
                    value={ni}
                    onChange={(e) => setNi(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="text"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="date"
                    placeholder="Data de Nascimento"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="date"
                    placeholder="Data de Contratação"
                    value={dataContratacao}
                    onChange={(e) => setDataContratacao(e.target.value)}
                    className={estilos.input}
                    required
                />

                 <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Cadastrar Gestor</button>
                </div>
            </form>
        </div>
    );
}
