
import '../styles/componentStyles/ImageSlider.css';
import banner1 from '/images/banner1.jpg';
import banner2 from '/images/banner2.jpg';
import banner3 from '/images/banner3.jpg';
import banner4 from '/images/banner4.jpg';
import banner5 from '/images/banner5.jpg';
import banner6 from '/images/banner6.jpg';
import banner7 from '/images/banner7.jpg';
import banner8 from '/images/banner8.png';
import banner9 from '/images/banner9.png';
import banner10 from '/images/banner10.jpg';
import banner11 from '/images/banner11.jpg';
import banner12 from '/images/banner12.jpg';
import banner13 from '/images/banner13.jpg';
import banner14 from '/images/banner14.jpg';
import banner15 from '/images/banner15.jpg';
import banner16 from '/images/banner16.jpg';
import banner17 from '/images/banner17.jpg';
import { useEffect, useState } from 'react';

const ImageSlider = () => {
  const images = [banner1, banner2, banner3, banner4,banner5,banner6,banner7,banner8,banner9,banner10,banner11,banner12,banner13,banner14,banner15,banner16,banner17]; // restored the original order
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="image-slider-container">
      <div
        className="slider-images"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {images.map((banner, index) => (
          <div className="slider-item" key={index}>
            <img src={banner} alt={`slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;