import { Link } from 'react-router-dom';
import estilos from './BarraNavegacao.module.css';

export function BarraNavegacao() {
    return (
        <nav className={estilos.conteiner}>
            <ul>
                <li><Link to="/conteudo" className={estilos.active}>Home</Link></li>
                <li><Link to="/">Login</Link></li>
                <li><Link to="#">Visão</Link></li>
                <li><Link to="#">Valores</Link></li>
            </ul>
        </nav>
    );
}
