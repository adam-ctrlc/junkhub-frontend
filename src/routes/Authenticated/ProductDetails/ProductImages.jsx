export default function ProductImages({
  images,
  selectedImage,
  onSelectImage,
  title,
}) {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
        <img
          src={images[selectedImage]}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-indigo-600 ring-2 ring-indigo-100"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
