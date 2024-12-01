const express = require("express");
const app = express();
const de = require("dotenv");
const mongoose = require("mongoose");
const millRoutes = require("./routes/MillRoutes");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const isAdmin = require("./middleware/isAdmin");
de.config();
const Mill = require("./models/MillModel");
const {
  converAndTransformToDate,
  convertFromStrTomMs,
} = require("./crud/functions");
const isLoggedIn = require("./middleware/isLoggedIn");
const db = process.env.DB.replace("<db_password>", process.env.DB_PASS);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
// 3600000 * 2
// app.use("/", async (req, res, next) => {
//   await Mill.deleteMany();
// });
app.use(cookiParser());
// app.use(isLoggedIn)
app.use("/mill", millRoutes);
app.use("/users", userRoute);

mongoose
  .connect(db)
  .then(() => console.log("connected to db ✅"))
  .catch((err) => console.log(err));

app.use((err, req, res, next) => {
  // if (err) {
  return res.status(404).json({
    status: "err",
    message: err,
  });
  // }
});
app.listen(process.env.PORT || 8000, () => {
  console.log("lisenting to port");
});
