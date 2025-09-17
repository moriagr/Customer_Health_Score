import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

import customerRoutes from "./routes/customers";
import dashboardRoute from "./routes/dashboard";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoute);

const frontendPath = "/app/frontend/build";

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
export default app;