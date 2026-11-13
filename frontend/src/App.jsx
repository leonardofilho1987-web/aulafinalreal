import { Routes, Route, Navigate } from 'react-router-dom'
import Configuracoes from './Paginas/Configuracoes'
import Feed from './Paginas/Feed'
import Login from './Paginas/Login'
import Perfil from './Paginas/Perfil'



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Feed />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />

      <Route path="*" element={<Navigate to="/" />} />
 
    </Routes>
  )}

export default App