// ============================================================
//  Dados de exemplo do "Instaclone"
//
//  Para usar:  npm run seed
//
//  Apaga o que existe no banco e cria 5 pessoas, cada uma com
//  3 posts. A senha de todas elas é 123456.
//  As fotos já estão na pasta uploads.
// ============================================================

import bcrypt from 'bcryptjs'
import banco from './banco.js'

const exemplos = [
  {
    usuario: 'ana',
    nome: 'Ana Souza',
    bio: 'Montanhas, trilhas e pôr do sol.',
    foto: 'perfil-ana.svg',
    posts: [
      { imagem: 'foto-01.svg', legenda: 'Fim de tarde na serra.' },
      { imagem: 'foto-02.svg', legenda: 'Dias assim valem a subida.' },
      { imagem: 'foto-03.svg', legenda: 'O céu pintou tudo de rosa.' },
    ],
  },
  {
    usuario: 'bruno',
    nome: 'Bruno Lima',
    bio: 'Mar, vento e café quente.',
    foto: 'perfil-bruno.svg',
    posts: [
      { imagem: 'foto-04.svg', legenda: 'Maré baixa e mente tranquila.' },
      { imagem: 'foto-05.svg', legenda: 'Domingo de vento a favor.' },
      { imagem: 'foto-06.svg', legenda: 'O mar sempre sabe o que dizer.' },
    ],
  },
  {
    usuario: 'carla',
    nome: 'Carla Mendes',
    bio: 'Jardim, flores e plantas.',
    foto: 'perfil-carla.svg',
    posts: [
      { imagem: 'foto-07.svg', legenda: 'A primavera chegou no quintal.' },
      { imagem: 'foto-08.svg', legenda: 'Pequenos jardins, grandes alegrias.' },
      { imagem: 'foto-09.svg', legenda: 'Cada flor tem a sua hora.' },
    ],
  },
  {
    usuario: 'diego',
    nome: 'Diego Rocha',
    bio: 'Cidade grande, luzes e noite.',
    foto: 'perfil-diego.svg',
    posts: [
      { imagem: 'foto-10.svg', legenda: 'A cidade nunca dorme.' },
      { imagem: 'foto-11.svg', legenda: 'Luzes acesas, ideias também.' },
      { imagem: 'foto-12.svg', legenda: 'A última janela acesa do prédio.' },
    ],
  },
  {
    usuario: 'elisa',
    nome: 'Elisa Torres',
    bio: 'Florestas, desertos e auroras.',
    foto: 'perfil-elisa.svg',
    posts: [
      { imagem: 'foto-13.svg', legenda: 'Silêncio de floresta.' },
      { imagem: 'foto-14.svg', legenda: 'Dunas e horizonte sem fim.' },
      { imagem: 'foto-15.svg', legenda: 'Auroras valem qualquer frio.' },
    ],
  },
]

// Apaga os dados antigos (as tabelas continuam existindo)
banco.exec('DELETE FROM posts')
banco.exec('DELETE FROM usuarios')
banco.exec('DELETE FROM sqlite_sequence') // faz os ids voltarem a começar do 1

// A senha nunca é guardada como está: guardamos só a "mistura" (hash) dela
const senhaComHash = bcrypt.hashSync('123456', 10)

exemplos.forEach((pessoa) => {
  const resultado = banco
    .prepare('INSERT INTO usuarios (usuario, senha, nome, bio, foto) VALUES (?, ?, ?, ?, ?)')
    .run(pessoa.usuario, senhaComHash, pessoa.nome, pessoa.bio, pessoa.foto)

  pessoa.posts.forEach((post) => {
    banco
      .prepare('INSERT INTO posts (usuario_id, imagem, legenda) VALUES (?, ?, ?)')
      .run(resultado.lastInsertRowid, post.imagem, post.legenda)
  })
})

console.log('Pronto! Criei 5 pessoas e 15 posts de exemplo.')
console.log('Para entrar, use ana, bruno, carla, diego ou elisa, com a senha 123456.')
