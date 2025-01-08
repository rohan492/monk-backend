/*
  EXAMPLE_REQUEST:
    {"cart": {
      "items": [
        {"product_id": 1, "quantity": 6, "price": 50}, // Product X
        {"product_id": 2, "quantity": 3, "price": 30}, // Product Y
        {"product_id": 3, "quantity": 2, "price": 25} // Product Z
      ]
    }}

  EXAMPLE_RESPONSE:
    {
      "applicable_coupons": [
        {
          "coupon_id": 9,
          "type": "cart-wise",
          "discount": 44
        },
        {
          "coupon_id": 10,
          "type": "product-wise",
          "discount": 60
        },
        {
          "coupon_id": 11,
          "type": "bxgy",
          "discount": 50
        }
      ]
    }
*/

import { neon } from "@neondatabase/serverless";
import { calculateDiscount } from "../utils/discountCalculationHelpers.js";
import combinations from "combinations";

const sql = neon(process.env.DATABASE_URL);

const applicableCoupons = async (req, res) => {
  try {
    console.log(req.body);
    const getAllCouponsQuery = `
      SELECT * FROM coupons
    `;
    const coupons = await sql(getAllCouponsQuery);
    const {
      cart: { items: itemsArray },
    } = req.body;

    const applicableCoupons = coupons
      ?.map((coupon) => ({
        coupon_id: coupon?.id,
        type: coupon?.type,
        discount: calculateDiscount(coupon, itemsArray),
      }))
      ?.filter((coupon) => coupon?.discount > 0);

    const couponCombinations = combinations(applicableCoupons);
    console.log(couponCombinations);

    let maxDiscount = 0;
    let bestCombination = [];

    couponCombinations?.forEach((combination) => {
      const totalDiscount = combination?.reduce(
        (sum, coupon) => sum + coupon?.discount,
        0
      );
      if (totalDiscount > maxDiscount) {
        maxDiscount = totalDiscount;
        bestCombination = combination;
      }
    });

    res.status(200).json({ applicable_coupons: bestCombination });
  } catch (error) {
    console.error("Error finding applicable coupons:", error);
    res.status(500).send("Error finding applicable coupons");
  }
};

export { applicableCoupons };
