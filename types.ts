export type Author = {
  _id: string;
  username: string;
  email: string;
};

export type Geometry = {
  type: string;
  coordinates: number[]
};

export type Image = {
  url: string;
  filename: string;
  _id: string;
};

export type Review = {
    _id: string
    review: string
    rating: number
    author: Author
}

export type Campground = {
  _id: string;
  images: Image[];
  title: string;
  price: number;
  description: string;
  location: string;
  author: Author;
  geometry: Geometry;
  reviews: Review[]
  properties?: { popUpMarkup: string };
};
