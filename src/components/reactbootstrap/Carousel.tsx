import Carousel from "react-bootstrap/Carousel";

function DarkVariantExample({ images, showArrows }) {
  return (
    <Carousel controls={showArrows} data-bs-theme="dark">
      <Carousel.Item>
        <img className="d-block w-100" src={images[0].url} alt="First slide" />
        
      </Carousel.Item>
      {images.slice(1).map((img, i) => (
        <Carousel.Item>
          <img className="d-block w-100" src={img.url} alt="image" />
          
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default DarkVariantExample;
