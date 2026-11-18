import { urlFoto } from '../api.js'
import Avatar from './Avatar.jsx'




function Post({ post }) {
    return (
        <article className="card mb-5">
            <div className="card-body flex-row align-items-center py-4">
                <Avatar foto={post.fotoAutor} />
                <strong>{post.autor}</strong>
            </div>
            <img
                className="w-100 ratio-1x1 object-fit-cover"
                src={urlFoto(post.imagem)}
                alt={post.legenda}
            />
            <div className="card-body py-4">
                <p>
                    <strong>{post.autor}</strong> {post.legenda}
                </p>
            </div>
        </article>
    )
}