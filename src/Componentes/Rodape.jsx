import estilos from './Rodape.module.css';

export function Rodape() {
    return (
        <footer className={estilos.rodape}>
            <div className={estilos.conteudo}>
                <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
                <nav>
                    <a href="#politica">Política de Privacidade</a>
                    <a href="#termos">Termos de Uso</a>
                </nav>
            </div>
        </footer>
    );
}
