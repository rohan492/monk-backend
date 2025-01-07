import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";

import couponRoutes from "./routes/couponRoutes.js";
import { applicableCoupons } from "./controllers/applicableCouponsController.js";
import { applyCoupon } from "./controllers/applyCouponController.js";

const app = express();
const upload = multer();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());

app.get("/", (req, res) => {
  res.send(`Hello World! My Super Secret is: ${process.env.SUPER_SECRET}`);
});

app.use("/coupons", couponRoutes);

app.post("/applicable-coupons", applicableCoupons);
app.post("/apply-coupon/:id", applyCoupon);

app.listen(PORT || 3000, () => {
  console.log("Listening on PORT: ", PORT);
});
