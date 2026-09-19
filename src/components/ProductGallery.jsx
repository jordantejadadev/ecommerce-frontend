import { useState } from "react";

export default function ProductGallery({ mainImage, images }) {
  const allImages = [mainImage, ...(images || [])].filter(Boolean);
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {allImages.length > 0 ? (
          <img
            src={allImages[current]}
            alt=""
            className="h-[450px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[450px] w-full items-center justify-center bg-gray-100 text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {allImages.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 cursor-pointer transition ${
                index === current ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
