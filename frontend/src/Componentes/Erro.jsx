import { TriangleAlert } from "lucide-react";

function Erro({erro}) {
    return (
        <>
        {erro && (
            <div className=" alert theme-danger" role="alert">
                <TriangleAlert size={18} />{erro}
            </div>
        )}
        
        </>
    )
}

export default Erro