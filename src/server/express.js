import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import session from "express-session";
import campgroundRouter from "./routes/campgrounds.js";
import reviewRouter from "./routes/reviews.js";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sessionConfig = {
  secret: "asecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));

app.use("/api/campgrounds", campgroundRouter);
app.use("/api/campgrounds/:id/review", reviewRouter);

app.get("/api/test", (req, res) => {
  res.json({ message: "Hey" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
