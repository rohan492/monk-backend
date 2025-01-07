import express from "express";
import {
  createNewCoupons,
  deleteSpecificCoupon,
  getAllCoupons,
  getSpecificCoupon,
  updateSpecificCoupon,
} from "../controllers/couponController.js";
import { validateCoupons } from "../middlewares/couponValidationMiddleware.js";

const router = express.Router();

router.post("/", validateCoupons, createNewCoupons);

router.get("/", getAllCoupons);
router.get("/:id", getSpecificCoupon);

router.put("/:id", validateCoupons, updateSpecificCoupon);

router.delete("/:id", deleteSpecificCoupon);

export default router;
