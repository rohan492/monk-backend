import express from "express";
import {
  createNewCoupons,
  deleteSpecificCoupon,
  getAllCoupons,
  getSpecificCoupon,
  updateSpecificCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/", createNewCoupons);

router.get("/", getAllCoupons);
router.get("/:id", getSpecificCoupon);

router.put("/:id", updateSpecificCoupon);

router.delete("/:id", deleteSpecificCoupon);

export default router;
