const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//env config
dotenv.config();

//router import
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

//Connecting MongoDB
connectDB();

//rest objecct
const app = express();

//middelwares
app.use(cors()); // Server Port = 8000 || client Port = 3000 >> going to Error !! but Cors Help it
app.use(express.json());
app.use(morgan("dev"));

//routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Node Server",
  });
});

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Port
const PORT = process.env.PORT || 8000;

//listen
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE}  PORT ${PORT}`);
});
