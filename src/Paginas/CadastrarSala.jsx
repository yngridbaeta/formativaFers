import { useEffect, useState } from 'react';
import estilos from './Cadastros.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export function CadastroSala() {
    const [salas, setSalas] = useState([]);  
    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm();

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
                console.error('Erro ao buscar salas:', error);
            }
        };
        fetchSalas();
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem("access");

        try {
            await axios.post(
                'http://localhost:8000/api/sala/',
                { nome: data.nome },  
                {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                }
            );
            reset();
            navigate('/salas');
        } catch (error) {
            console.error('Erro ao cadastrar Sala:', error);
        }
    };

    return (
        <div className={estilos.container}>
            <form className={estilos.formulario} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={estilos.titulo}>Cadastro Sala</h2>

                <input
                    type="text"
                    placeholder="Nome da Sala"
                    {...register('nome', { required: true })}
                    className={estilos.input}
                />

                <div className={estilos.divBotao}>
                    <button type="submit" className={estilos.botao}>Cadastrar Sala</button>
                </div>
            </form>
        </div>
    );
}
