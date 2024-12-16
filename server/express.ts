const dotenv = await import("dotenv");
dotenv.config();
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
import bookingRouter from "./routes/bookings.ts";
import passport from "passport";
import { Strategy } from "passport-local";
import helmet from "helmet";
import User from "./repositories/users.ts";
import mongoSanitize from "express-mongo-sanitize";
import { clearCache } from "./controllers/campgrounds.ts";
import path from "path";
import MongoStore from "connect-mongo";
const dbUrl = process.env.DB_URL!;

interface IExpressError extends Error {
  status: number;
}

interface ISessionConfig {
  secret: string;
  store: MongoStore;
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
  .then(() => console.log(`DB Connected sucessfully`))
  .catch((err) => console.log(`DB Failed to connect: ${err}`));

//"mongodb://127.0.0.1:27017/myProject"

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: "pleasedontreadthisthankyou" },
});

app.use(express.static("dist"));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sessionConfig: ISessionConfig = {
  secret: "pleasedontreadthisthankyou",
  store: store,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() * 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

const apiRouter = express.Router();

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use("/api", apiRouter);

apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

apiRouter.use("/", userRouter);
apiRouter.use("/booking", bookingRouter);
apiRouter.use("/campgrounds", campgroundRouter);
apiRouter.use("/campgrounds/:id/review", reviewRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./dist", "index.html"));
});
clearCache();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const { status = 500, message = "Internal Server Error" } =
    err as IExpressError;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
