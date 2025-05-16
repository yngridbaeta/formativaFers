import { Link } from "react-router-dom";  // Importe o Link para navegação
import estilos from './Menu.module.css';
import professoresIcon from '../assets/professor.png';
import gestoresIcon from '../assets/gestor.png';
import disciplinaIcon from '../assets/disciplina.png';
import salaIcon from '../assets/ambiente.png';
import ambienteIcon from '../assets/school.png';

export function Menu() {
    return (
        <div className={estilos.conteiner}>
            <div className={estilos.cardContainer}>
            <h2 className={estilos.titulo}>Categorias</h2>

                    <div className={estilos.grid}>

                        <Link to="/professores">
                            <div className={estilos.item}>
                                <img src={professoresIcon} alt="Professores" />
                                <span>Professores</span>
                            </div> 
                        </Link>
                        
                        <Link to="/gestores">
                            <div className={estilos.item}>
                                <img src={gestoresIcon} alt="Gestores" />
                                <span>Gestores</span>
                            </div>
                        </Link>
                    

                        <Link to="/disciplinas" className={estilos.link}>
                            <div className={estilos.item}>
                                <img src={disciplinaIcon} alt="Disciplina" />
                                <span>Disciplinas</span>
                            </div>
                        </Link>

                        <Link to="/ambientes">
                            <div className={estilos.item}>
                                <img src={ambienteIcon} alt="Ambiente" />
                                <span>Ambientes</span>
                            </div>
                        </Link>

                        <Link to="/salas">
                            <div className={estilos.item}>
                                <img src={salaIcon} alt="Sala" />
                                <span>Salas</span>
                            </div>
                        </Link>

                    </div>
        
            </div>
        </div>
    );
}
