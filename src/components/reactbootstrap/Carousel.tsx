import Carousel from "react-bootstrap/Carousel";
import { Image } from "../../../types";



function ReactCarousel({
  images,
  showArrows,
}: {
  images: Image[];
  showArrows: boolean;
}) {
  return (
    <Carousel controls={showArrows} data-bs-theme="dark">
      <Carousel.Item
        key={images[0]._id}
        style={{ height: "500px", width: "100%" }}
      >
        <img
          className="d-block img-fluid"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={images[0].url}
          alt="First slide"
        />
      </Carousel.Item>
      {images.slice(1).map((img: Image) => (
        <Carousel.Item key={img._id} style={{ height: "500px", width: "100%" }}>
          <img
            className="d-block w-100"
            style={{ minHeight: "100%", minWidth: "100%", objectFit: "cover" }}
            src={img.url}
            alt="image"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ReactCarousel;
