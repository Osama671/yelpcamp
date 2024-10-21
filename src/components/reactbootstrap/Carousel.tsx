import Carousel from "react-bootstrap/Carousel";
import { Image } from "../../../types";

function ReactCarousel({
  images,
  showArrows,
  styles
}: {
  images: Image[];
  showArrows: boolean;
  styles?: CSSModuleClasses
}) {
  if (images.length === 0)
    images = [
      {
        url: "https://i.pinimg.com/736x/d6/22/4b/d6224b4bfff79ecc55a028c969d4c8e3.jpg",
        filename: "",
        _id: "1",
      },
    ];
  return (
    <>
      <Carousel controls={showArrows} data-bs-theme="dark">
        <Carousel.Item
          key={images[0]._id}
          style={{ height: "500px", width: "100%" }}
        >
          <img
            className={`${styles?.carouselImage}`}
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
            src={images[0].url}
            alt="First slide"
          />
        </Carousel.Item>
        {images.slice(1).map((img: Image) => (
          <Carousel.Item
            key={img._id}
            style={{ height: "500px", width: "100%" }}
          >
            <img
              className={`${styles?.carouselImage} d-block w-100`}
              style={{
                minHeight: "100%",
                minWidth: "100%",
                objectFit: "cover",
              }}
              src={img.url}
              alt="image"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default ReactCarousel;
