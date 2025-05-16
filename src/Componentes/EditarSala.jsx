import React, { useState, useEffect } from 'react';
import axios from 'axios';
import estilos from './EditarSala.module.css';

const EditarSala = ({ isOpen, onClose, onConfirm, item }) => {
  const [nome, setNome] = useState(item?.nome || '');

  useEffect(() => {
    if (item) {
      setNome(item.nome);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    axios
      .put(
        `http://localhost:8000/api/sala/${item.id}`,
        { nome },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        onConfirm(response.data); // Atualiza a lista de salas com os dados editados
        onClose();
      })
      .catch((error) => console.error('Erro ao editar sala', error.response || error));
  };

  if (!isOpen) return null;

  return (
    <div className={estilos.overlay}>
      <div className={estilos.modal}>
        <h3>Editar Sala</h3>
        <form onSubmit={handleSubmit}>
          <div className={estilos.formGroup}>
            <label htmlFor="nome">Nome da Sala</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className={estilos.buttons}>
            <button type="button" className={estilos.cancelButton} onClick={onClose}>
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

export default EditarSala;
