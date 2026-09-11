import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-semibold text-blue-600">Error 404</p>            
            <h1 className="mt-2 text-4xl font-bold text-gray-800">Esta página no existe</h1>
            <p className="mt-3 max-w-md text-gray-500">Puede que el enlace esté roto o que la página haya sido movida</p>
            <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">Volver al inicio</Link>
        </div>
    )
}