console.log(">>> INDEX LOADED <<<");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const histoireRouter = require("./routes/RoutesHistoire");
const authRouter = require("./routes/RoutesAuth");
const pageRouter = require("./routes/RoutesPage");
const choixRoutes = require("./routes/RoutesChoix");
const statsRoutes = require("./routes/RoutesStats");
const adminRoutes = require("./routes/RoutesAdmin");
const progressionRoutes = require("./routes/RoutesProgression");
const avisRoutes = require("./routes/RoutesAvis");

const cookieParser = require("cookie-parser");

dotenv.config();

console.log(">>> ENV LOADED :", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
});


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],  
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());



app.use("/histoire", histoireRouter);
app.use("/auth", authRouter);
app.use("/page", pageRouter);
app.use("/choix", choixRoutes);
app.use("/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use("/progression", progressionRoutes);
app.use("/avis", avisRoutes);

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
