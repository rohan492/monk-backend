/*
  EXAMPLE_REQUEST:
    {
      "cart": {
        "items": [
          {
            "product_id": 1,
            "quantity": 6,
            "price": 50
          },
          {
            "product_id": 2,
            "quantity": 3,
            "price": 30
          },
          {
            "product_id": 3,
            "quantity": 2,
            "price": 25
          }
        ]
      }
    }

  EXAMPLE_RESPONSE:
    {
      "updated_cart": {
        "items": [
          {
            "product_id": 1,
            "quantity": 6,
            "price": 50,
            "total_discount": 60
          },
          {
            "product_id": 2,
            "quantity": 3,
            "price": 30,
            "total_discount": 0
          },
          {
            "product_id": 3,
            "quantity": 4,
            "price": 25,
            "total_discount": 50
          }
        ],
        "total_price": 380,
        "total_discount": 38,
        "final_price": 342
      }
    }
*/

import { neon } from "@neondatabase/serverless";
import { calculateDiscount } from "../utils/applyDiscountHelpers.js";
import combinations from "combinations";
import { getTotal } from "../utils/reduceUtil.js";

const sql = neon(process.env.DATABASE_URL);

const applyCoupon = async (req, res) => {
  try {
    console.log(req.body);
    const getAllCouponsQuery = `
      SELECT * FROM coupons
    `;
    const coupons = await sql(getAllCouponsQuery);
    const {
      cart: { items: itemsArray },
    } = req.body;

    let finalArray = itemsArray?.map((item) => ({
      ...item,
      total_discount: 0,
      total_price: item?.price * item?.quantity,
    }));

    const cartWiseCoupons = [];
    const nonCartWiseCoupons = [];

    coupons?.forEach((coupon) => {
      if (coupon?.type === "cart-wise") {
        cartWiseCoupons.push(coupon);
      } else {
        nonCartWiseCoupons.push(coupon);
      }
    });

    const applicableCoupons = nonCartWiseCoupons
      ?.map((coupon) => ({
        coupon_id: coupon?.id,
        type: coupon?.type,
        discount: calculateDiscount(coupon, finalArray),
      }))
      ?.filter((coupon) => coupon?.discount > 0);

    const couponCombinations = combinations(applicableCoupons);
    console.log({ couponCombinations });

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

    const discountOnFinalCart = cartWiseCoupons
      ?.map((coupon) => ({
        coupon_id: coupon?.id,
        type: coupon?.type,
        discount: calculateDiscount(coupon, finalArray),
      }))
      ?.filter((coupon) => coupon?.discount > 0)
      ?.reduce((sum, { discount }) => sum + discount, 0);

    const totalPrice = getTotal(finalArray, "total_price");

    const response = {
      updated_cart: {
        items: finalArray?.map(({ total_price, ...item }) => item),
        total_price: totalPrice,
        total_discount: discountOnFinalCart,
        final_price: totalPrice - discountOnFinalCart,
      },
    };

    res.send(response);
  } catch (error) {
    console.error("Error applying coupons:", error);
    res.status(500).send("Error applying coupons");
  }
};

export { applyCoupon };
