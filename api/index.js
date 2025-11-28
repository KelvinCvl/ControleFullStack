const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const histoireRouter = require("./routes/RoutesHistoire");
const authRouter = require("./routes/RoutesAuth");
const pageRouter = require("./routes/RoutesPage");
const choixRoutes = require("./routes/RoutesChoix");
const statsRoutes = require("./routes/RoutesStats");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/histoire", histoireRouter);
app.use("/auth", authRouter);
app.use("/page", pageRouter);
app.use("/choix", choixRoutes);
app.use("/statistique", statsRoutes);

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
