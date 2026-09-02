import { useState } from 'react';

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop', alt: 'Classic fade haircut', category: 'haircut' },
  { id: 2, src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop', alt: 'Beard trim and shape', category: 'beard' },
  { id: 3, src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop', alt: 'Modern textured crop', category: 'haircut' },
  { id: 4, src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', alt: 'Hot towel shave', category: 'beard' },
  { id: 5, src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=600&fit=crop', alt: 'Men\'s styling', category: 'styling' },
  { id: 6, src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop', alt: 'Classic pompadour', category: 'styling' },
  { id: 7, src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop', alt: 'Beard design', category: 'beard' },
  { id: 8, src: 'https://images.unsplash.com/photo-1537581451741-87b9980a6597?w=600&h=600&fit=crop', alt: 'Hair coloring', category: 'treatment' },
  { id: 9, src: 'https://images.unsplash.com/photo-1607860281632-6bf5b8f0d0b9?w=600&h=600&fit=crop', alt: 'Skin fade', category: 'haircut' },
];

const handleImgError = (e) => {
  const img = e.target;
  img.style.display = 'none';
  const fallback = img.parentElement.querySelector('.img-fallback');
  if (fallback) fallback.style.display = 'flex';
};

const categories = [
  { value: 'all', label: 'All' },
  { value: 'haircut', label: 'Haircuts' },
  { value: 'beard', label: 'Beard' },
  { value: 'styling', label: 'Styling' },
  { value: 'treatment', label: 'Treatments' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image) => setSelectedImage(image);
  const closeLightbox = () => setSelectedImage(null);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">Our Work</h1>
          <p className="text-dark-600">A showcase of our recent cuts, styles, and grooming work</p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
              role="tab"
              aria-selected={activeCategory === cat.value}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {filteredImages.map((image, index) => (
            <article
              key={image.id}
              role="listitem"
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={handleImgError}
              />
              <div className="img-fallback absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center" style={{ display: 'none' }}>
                <span className="text-white font-display text-lg text-center px-4">{image.alt}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium text-sm w-full">{image.alt}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white/90 backdrop-blur-sm text-dark-900 px-2 py-1 rounded-full text-xs font-medium capitalize">{image.category}</span>
              </div>
            </article>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
                setSelectedImage(filteredImages[prevIndex]);
              }}
              className="absolute left-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full px-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={handleImgError}
              />
              <div className="img-fallback absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center rounded-lg" style={{ display: 'none' }}>
                <span className="text-white font-display text-2xl text-center px-4">{selectedImage.alt}</span>
              </div>
              <div className="mt-4 text-center text-white">
                <h3 className="font-display text-xl font-semibold">{selectedImage.alt}</h3>
                <span className="badge-primary mt-2 inline-block">{selectedImage.category}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % filteredImages.length;
                setSelectedImage(filteredImages[nextIndex]);
              }}
              className="absolute right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}