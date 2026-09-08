export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">Ecommerce</h3>
            <p className="text-sm text-grayy-400">
              Productos de calidad, entregados donde estés.
            </p>
          </div>

          <div>
            <h4>Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/productos" className="hover:text-white">
                  Todos los productos
                </a>
              </li>
              <li>
                <a href="/productos?ofertas=true" className="hover:text-white">
                  Ofertas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/envios" className="hover:text-white">
                  Envíos y devoluciones
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Síguenos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ecommerce. Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
