import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Todo lo que buscas, a un clic de distancia",
    subtitle:
      "Explora nuestro catálogo y encuentra productos pensados para ti.",
    image: "https://res.cloudinary.com/oyarlgdq/image/upload/v1788884908/slide1.1.jpg",
  },
  {
    title: "Nueva colección disponible",
    subtitle: "Descrube los productos más recientes de la temporada",
    image: "https://res.cloudinary.com/oyarlgdq/image/upload/v1788884907/slide1.2.jpg",
  },
  {
    title: "Envío gratia desde S/100",
    subtitle: "Aprovecha antes de que termina la promoción",
    image: "https://res.cloudinary.com/oyarlgdq/image/upload/v1788885072/slide.1.3.jpg",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] overflow-hidden bg-gray-900 text-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 px-4 sm:px-16">
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              {slide.title}
            </h1>
            <p className="max-w-md text-gray-200">{slide.subtitle}</p>
            <Link
              to="/products"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Ver productos
            </Link>
          </div>
        </div>
      ))}

      {/* Puntos de navegación */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${index === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
