import express from 'express'
import cors from 'cors'
import banco from './banco.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORTA = 3000
const SEGREDO = 'segredo-do-meu-site'

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

//NOSSO PORTEIRO
function exigirLogin(req, res, next) {
    const cabecalho = req.headers.authorization

    if (!cabecalho) {
        res.status(401).json({
            erro: "Faça login pra continuar"
        })
    }
    const token = cabecalho.split(' ')[1]

    try {
        const dados = jwt.verify(token, SEGREDO)
        req.usuarioId = dados.id
        next()

    } catch {
        res.status(401).json({
            erro: "Sessão inválida. Faça login novamente."
        })
    }
}

function buscarPessoa(id) {
    return banco
        .prepare('SELECT id, nome, usuario, foto FROM usuarios WHERE id = ?')
        .get(id)

}

app.post('/login', (req, res) => {
    const usuario = req.body.usuario
    const senha = req.body.senha

    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Informe o usuário e a senha.' })
    }

    const pessoa = banco
        .prepare('SELECT * FROM usuarios WHERE usuario = ?')
        .get(usuario)

    if (!pessoa || !bcrypt.compareSync(senha, pessoa.senha)) {
        return res.status(401).json({
            erro: 'Usuário ou senha incorreta.'
        })
    }

    const token = jwt.sign({ id: pessoa.id }, SEGREDO, { expiresIn: "7d" })

    res.json({ token: token })
})


// GET -> GET PERFIL
app.get('/perfil', exigirLogin, (req, res) => {
    const pessoa = buscarPessoa(req.usuarioId)
    res.json(pessoa)
})

//GET -> FEED
app.get('/feed', exigirLogin, (req, res) => {
    const posts = banco
        .prepare(`
        SELECT posts.id, posts.imagem, posts.legenda,
        usuarios.usuario AS autor, usuarios.foto AS fotoAutor
        FROM posts
        JOIN usuarios ON usuarios.id = posts.usuario_id
        ORDER BY RANDOM()
        LIMIT 10
         `)
        .all()
    res.json(posts)
})


app.listen(PORTA, () => {
    console.log("servidor iniciado na URL: http://localhost:" + PORTA);
})