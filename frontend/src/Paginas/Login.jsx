import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, LogIn, TriangleAlert } from 'lucide-react'
import { URL_API } from '../api.js'


function Login() {
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const navegar = useNavigate()

    // Se já tiver token salvo, manda direto para o Feed
    if (localStorage.getItem('token')) {
        return <Navigate to="/" replace />
    }

    async function entrar(evento) {
        evento.preventDefault()
        setErro('')

        if (!usuario.trim() || !senha.trim()) {
            setErro('Preencha o usuário e a senha.')
            return
        }

        setCarregando(true)

        try {
            const resposta = await fetch(`${URL_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, senha })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setErro(dados.erro || dados.mensagem || 'Usuário ou senha inválidos.')
                setCarregando(false)
                return
            }

            localStorage.setItem('token', dados.token)
            navegar('/', { replace: true })
        } catch {
            setErro('Não foi possível conectar ao servidor.')
            setCarregando(false)
        }
    }

    return (
        <main className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 md:col-6 xl:col-4">
                    <article className="card">
                        <div className="card-body text-center">
                            <h1 className="fs-2xl fg-primary d-flex justify-content-center align-items-center gap-2">
                                <Camera size={36} /> Instaclone
                            </h1>
                            <p>Entre para ver as fotos da galera.</p>

                            {erro && (
                                <div className="alert theme-danger d-flex align-items-center gap-2 text-start mb-3" role="alert">
                                    <TriangleAlert size={18} />
                                    <span>{erro}</span>
                                </div>
                            )}

                            <form className="d-grid gap-3" onSubmit={entrar}>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Usuário"
                                    aria-label="Usuário"
                                    value={usuario}
                                    onChange={(evento) => setUsuario(evento.target.value)}
                                />
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Senha"
                                    aria-label="Senha"
                                    value={senha}
                                    onChange={(evento) => setSenha(evento.target.value)}
                                />
                                <button className="btn-solid theme-primary" type="submit" disabled={carregando}>
                                    <LogIn size={18} /> {carregando ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                            <small className="fg-3 d-block mt-3">Para testar, entre com o usuário ana e a senha 123456.</small>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    )
}

export default Login