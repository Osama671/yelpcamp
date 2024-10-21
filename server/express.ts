if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import session from "express-session";
import campgroundRouter from "./routes/campgrounds.js";
import reviewRouter from "./routes/reviews.js";
import userRouter from "./routes/users.ts";
import bookingRouter from "./routes/bookings.ts"
import passport from "passport";
import { Strategy } from "passport-local";
import helmet from "helmet";
import User from "./repositories/users.ts";
import mongoSanitize from "express-mongo-sanitize";

interface IExpressError extends Error {
  status: number;
}

interface ISessionConfig {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    httpOnly: boolean;
    expires: Date;
    maxAge: number;
  };
}

const app = express();
const PORT = process.env.PORT || 8080;

main()
  .then(() => console.log(`DB Connected sucessfully XD`))
  .catch((err) => console.log(`DB Failed to connect: ${err}`));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myProject");
}

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sessionConfig: ISessionConfig = {
  secret: "asecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() * 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());

app.use("/api/", userRouter);
app.use("/api/booking", bookingRouter)
app.use("/api/campgrounds", campgroundRouter);
app.use("/api/campgrounds/:id/review", reviewRouter);

app.get("/api/test", async (_: Request, res: Response) => {
  const user = new User({ email: "test@hotmail.com", username: "Osama" });
  const newUser = await User.register(user, "monkey");
  res.send(newUser);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const { status = 500, message = "Internal Server Error" } =
    err as IExpressError;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
