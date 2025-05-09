import { Link } from "react-router-dom";  // Importe o Link para navegação
import estilos from './Menu.module.css';
import professoresIcon from '../assets/professor.png';
import gestoresIcon from '../assets/gestor.png';
import disciplinaIcon from '../assets/disciplina.png';
import ambienteIcon from '../assets/ambiente.png';

export function Menu() {
    return (
        <div className={estilos.conteiner}>
            <div className={estilos.cardContainer}>
                <h2 className={estilos.titulo}>Categorias</h2>
                <div className={estilos.grid}>
                    <div className={estilos.item}>
                        <img src={professoresIcon} alt="Professores" />
                        <span>Professores</span>
                    </div>
                    <div className={estilos.item}>
                        <img src={gestoresIcon} alt="Gestores" />
                        <span>Gestores</span>
                    </div>
                    {/* Link para a página de Disciplina */}
                    <Link to="/disciplinas" className={estilos.link}>
                        <div className={estilos.item}>
                            <img src={disciplinaIcon} alt="Disciplina" />
                            <span>Disciplina</span>
                        </div>
                    </Link>

                    <Link to="/ambientes">
                        <div className={estilos.item}>
                            <img src={ambienteIcon} alt="Ambiente" />
                            <span>Ambiente</span>
                        </div>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
}
