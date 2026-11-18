import { useState, useEffect } from "react"
import { ImagePlus, Images, upload, TriangleAlert } from 'lucide-react'
import { camarApi, urlFoto } from '../api.js'
import Avatar from '../componentes/Avatar'
import { Form } from "react-router-dom"

function Perfil() {
  const [pessoa, setPessoa] = useState(null)
  const [erro, setErro] = useState('')

  async function carregarPerfil() {
    try {
      const dados = await chamarApi('/perfil')
      setPessoa(dados)
      setErro('')
    } catch (problema) {
      setErro(problema.message)
    }
  }

  useEffect(() => {
    carregarPerfil()
  }, [])

  async function publicar(evento) {
    evento.preventDefault()
    const formulario = evento.target

    try {
      await chamarApi('/posts', 'POST', new FormData(formulario))
      formulario.reset()
      carregarPerfil()
    } catch (problema) {
      setErro(problema.message)
    }
  }

  return (
    <>
      {erro && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <TriangleAlert size={20} />
          <span>{erro}</span>
        </div>
      )}

      {pessoa && (
        <>
          <section className="d-flex align-items-center gap-6 mb-7">
            <Avatar foto={pessoa.foto} grande />
            <div>
              <h1 className="fs-xl mb-1">{pessoa.usuario}</h1>
              <strong>{pessoa.nome}</strong>
              <small className="fg-3 d-block">
                Publicações: {pessoa.posts ? pessoa.posts.length : 0}
              </small>
            </div>
          </section>

          <article className="card mb-7">
            <div className="card-body">
              <h2 className="fs-lg d-flex align-items-center gap-2">
                <ImagePlus size={22} /> Nova publicação
              </h2>
              <form onSubmit={publicar} className="d-grid gap-3">
                <input type="file" name="foto" required />
                <input type="text" name="legenda" placeholder="Escreva uma legenda..." />
                <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-2">
                  <Upload size={18} /> Publicar
                </button>
              </form>
            </div>
          </article>
        </>
      )}
    </>
  )
}

export default Perfil