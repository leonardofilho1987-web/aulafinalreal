import { NavLink, useNavigate } from 'react-router-dom'
import { Camera, House, User, Settings, LogOut } from 'lucide-react'

function Menu() {
    const navegar = useNavigate()

    function sair() {
        localStorage.removeItem('token')
        navegar('/login')
    }

    return (
        <header className="navbar navbar-expand sticky-top border-bottom">
            <nav className="container flex-wrap">
                <span className="navbar-brand d-flex align-items-center gap-2 fw-bold fg-primary">
                    <Camera size={28} /> Instaclone

                </span>

                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" aria-label="Feed">
                            <House size={28} />
                            <span className="d-none md:d-inline">Feed</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/perfil"
                            arial-label="Perfil">
                            <User size={28} />
                            <span className="d-none md:d-inline">Perfil</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" to="configuracoes"
                            aria-label='Configuracoes'>
                            <User size={28} />
                            <span className="d-none md:d-inline">Configurações</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link" aria-label='Sair' onClick={sair}>
                            <LogOut size={28} />
                            <span className="d-none md:d-inline">Sair</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Menu