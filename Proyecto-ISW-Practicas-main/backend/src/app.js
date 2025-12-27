import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerApi } from "./routes/index.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
routerApi(app);

export default app;