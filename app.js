import express from "express";
import appRoutes from "./routes/app.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { useModerator } from "./middlewares/moderator.js";
const moderator = useModerator();
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(moderator.bypassWhitelistedDomain);
app.use(moderator.verifyToken);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/app", appRoutes);
export default app;
