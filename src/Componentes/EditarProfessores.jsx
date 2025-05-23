import React, { useState, useEffect } from "react";
import axios from "axios";
import estilos from './EditarSala.module.css'; // Pode ser renomeado depois

const EditarProfessores = ({ isOpen, onClose, onConfirm, item }) => {
    const [nome, setNome] = useState(''); // Nome do professor
    const [username, setUsername] = useState(''); // Username (login) do professor
    const [registro, setRegistro] = useState('');
    const [email, setEmail] = useState(''); // Email do professor
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataContratacao, setDataContratacao] = useState('');
    const [password, setPassword] = useState(''); // Para o caso de editar a senha

    // Carregar dados para o modal
    useEffect(() => {
        if (isOpen && item) {
            setNome(item.nome ?? ''); // Usando item.nome como nome
            setUsername(item.username ?? ''); // Usando item.username para o campo de login
            setRegistro(item.ni ?? '');
            setEmail(item.email ?? ''); // Não vamos alterar o email se não for modificado
            setTelefone(item.telefone ?? '');

            // Formatar as datas corretamente
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return date.toISOString().split('T')[0]; // Retorna só o "YYYY-MM-DD"
            };

            setDataNascimento(formatDate(item.dataNascimento));
            setDataContratacao(formatDate(item.dataContratacao));
            setPassword(''); // Por segurança, não preencher a senha inicialmente
        }
    }, [isOpen, item]); // Certifique-se de que o item seja atualizado

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");

        // A senha atual é recuperada do item.password
        const currentPassword = item.password; // Supondo que a senha original esteja em 'item.password'

        // O payload vai incluir a senha atual, a menos que o usuário tenha alterado
        const payload = {
            nome, // Nome do professor
            username, // Username do professor
            ni: parseInt(registro, 10), // Certifique-se de que o formato de "registro" seja o esperado pela API
            email,
            telefone,
            dataNascimento,
            dataContratacao,
            categoria: 'P',
            // Inclui a senha apenas se o campo password não estiver vazio
            ...(password && { password }) // Se password tiver algum valor, ele será incluído no payload
        };

        try {
            const response = await axios.patch(
                `http://localhost:8000/api/funcionario/${item.id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onConfirm(response.data);
            onClose();
        } catch (error) {
            console.error('Erro ao editar professor', error.response?.data || error);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className={estilos.overlay}>
            <div className={estilos.modal}>
                <h3>Editar Professor</h3>
                <form onSubmit={handleSubmit}>
                    <div className={estilos.formGroup}>
                        <label htmlFor="nome">Nome:</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <label htmlFor="username">Username (Login):</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label htmlFor="registro">Registro:</label>
                        <input
                            id="registro"
                            type="text"
                            value={registro}
                            onChange={(e) => setRegistro(e.target.value)}
                            required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="telefone">Telefone:</label>
                        <input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />

                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <input
                            id="dataNascimento"
                            type="date"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            required
                        />

                        <label htmlFor="dataContratacao">Data de Contratação:</label>
                        <input
                            id="dataContratacao"
                            type="date"
                            value={dataContratacao}
                            onChange={(e) => setDataContratacao(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Nova Senha (Deixe em branco se não quiser alterar):</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={estilos.buttons}>
                        <button type="button" onClick={onClose} className={estilos.cancelButton}>
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

export default EditarProfessores;
