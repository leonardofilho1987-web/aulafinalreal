import express from 'express'
import cors from 'cors'
import banco from './banco.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'


const app = express()
const PORTA = 3000
const SEGREDO = 'segredo-do-meu-site'

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads',
        filename: (req, arquivo, avisar) => {
            avisar(null, Date.now() + path.extname(arquivo.originalname))
        },
    }),
})


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
    pessoa.post = banco
        .prepare('SELECT id, imagem,legenda FROM posts WHERE usuario_id = ? ORDER BY id DESC')
        .all(req.usuarioId)
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


//POST -> POSTS
app.post('/posts', exigirLogin, upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: 'Você não enviou nenhum foto.' })
    }

    const legenda = req.body.legenda || ''


    const resultado = banco
        .prepare('INSERT INTO posts (usuario_id, imagem, legenda) VALUES (?, ?, ?)')
        .run(req.usuarioId, req.file.filename, legenda)

    const novo = {
        id: resultado.lastInsertRowid,
        imagem: req.file.filename,
        legenda: legenda
    }
})

// PATCH -> PERFIL
app.patch('/perfil', exigirLogin, upload.single('foto'), (req, res) => {
    const nome = (req.body.nome || '').trim()
    const bio = (req.body.bio || '').trim()

    if (nome === '') {
        return res.status(400).json({ erro: 'O nome não pode ficar vazio.' })
    }

    banco
        .prepare('UPDATE usuarios SET nome = ?, bio = ? WHERE id = ?')
        .run(nome, bio, req.usuarioId)

    if (req.file) {
        banco
            .prepare('UPDATE usuarios SET foto = ? WHERE id = ?')
            .run(req.file.filename, req.usuarioId)
    }

    res.json(buscarPessoa(req.usuarioId))

})


app.listen(PORTA, () => {
    console.log("servidor iniciado na URL: http://localhost:" + PORTA);
})