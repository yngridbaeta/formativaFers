import { useState } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CadastroProfessor() {
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
    
        // Convertendo 'ni' para inteiro
        const niNumber = parseInt(ni, 10);
    
        // Verificando se a conversão foi bem-sucedida
        if (isNaN(niNumber)) {
            console.error("O número de identificação (NI) é inválido.");
            return;
        }
    
        // Adicionando um log para verificar os dados
        console.log("Dados enviados:", {
            username,
            nome,
            ni: niNumber, // Envia como número
            categoria: 'P',
            email,
            telefone,
            dataNascimento,
            dataContratacao
        });
    
        try {
            await axios.post(
                'http://localhost:8000/api/funcionario/',
                {
                    username,
                    password,
                    nome,
                    ni,
                    categoria: 'P',
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
    
            navigate('/professores');
        } catch (error) {
            console.error('Erro ao cadastrar professor', error);
        }
    };
    

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit}>
                <h2 className={estilos.titulo}>Cadastro de Professor</h2>

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
                    placeholder="Nome do professor"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={estilos.input}
                    required
                />

                <input 
                    type="number"
                    placeholder="Número de Identificação (NI)"
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
                    <button type="submit" className={estilos.botao}>Cadastrar Professor</button>
                </div>
            </form>
        </div>
    );
}
