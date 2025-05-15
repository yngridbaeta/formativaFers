import { BarraNavegacao } from "./Componentes/BarraNavegacao";
import { Cabecalho } from "./Componentes/Cabecalho";
import { Conteudo } from "./Componentes/Conteudo";
import { Rodape } from "./Componentes/Rodape";
import { Disciplinas } from "./Paginas/Disciplinas";  // Importe a página de disciplinas
import { Login } from "./Paginas/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CadastroDisciplina } from "./Paginas/CadastroDisciplinas";
import { Menu } from "./Componentes/Menu";
import { Ambiente } from "./Paginas/Ambiente";
import { CadastroAmbiente } from "./Paginas/CadastroAmbiente";
function App() {
  return (
    <Router>
      <BarraNavegacao />
      <Cabecalho />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/disciplinas" element={<Disciplinas />} /> 
        <Route path="/conteudo" element={<Conteudo />} /> 
        <Route path="/cadastroDisciplina" element={<CadastroDisciplina />} /> 
        <Route path="/ambientes" element={<Ambiente/>} />
        <Route path="/cadastroAmbiente" element={<CadastroAmbiente/>} />
      </Routes>
      <Rodape />
    </Router>
  );
}

export default App;