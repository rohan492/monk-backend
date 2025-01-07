/*
    Coupons must be formatted as 1 of the following 3 types:
        1. Cart-Wise    =>  {
                                type: "cart-wise",
                                details: {
                                    threshold: 100,
                                    discount: 10
                                }    
                            }
        2. Product-Wise => {
                                type: "product-wise",
                                details: {
                                    product_id: 1,
                                    discount: 20
                                }
                            }
        3. BxGy         =>  {
                                type: "bxgy",
                                details: {
                                    buy_products: [
                                        { product_id: 1, quantity: 3 },
                                        { product_id: 2, quantity: 3 }
                                    ],
                                    get_products: [
                                        { product_id: 3, quantity: 1 }
                                    ],
                                    repitition_limit: 2
                                }
                            }
*/

import { customErrorMessages } from "../utils/couponValidationHelpers.js";

const validateCoupons = async (req, res, next) => {
  const { type, details } = req.body;

  if (!type || !details) {
    return customErrorMessages(res, "NO_TYPE_AND_DETAILS");
  }

  const validCouponTypes = ["cart-wise", "product-wise", "bxgy"];
  if (!validCouponTypes.includes(type)) {
    return customErrorMessages(res, "INVALID_COUPON_TYPE");
  }

  const {
    threshold,
    discount,
    product_id,
    buy_products,
    get_products,
    repitition_limit,
  } = details;

  switch (type) {
    case "cart-wise":
      if (!threshold || !discount) {
        return customErrorMessages(
          res,
          "REQUIRED",
          "'threshold' & 'discount'",
          "Cart Wise Coupons"
        );
      }
      if (typeof threshold !== "number" || typeof discount !== "number") {
        return customErrorMessages(
          res,
          "VALID_DATA_TYPE",
          "'threshold' & 'discount'"
        );
      }
      break;
    case "product-wise":
      if (!product_id || !discount) {
        return customErrorMessages(
          res,
          "REQUIRED",
          "'product_id' & 'discount'",
          "Product Wise Coupons"
        );
      }
      if (typeof product_id !== "number" || typeof discount !== "number") {
        return customErrorMessages(
          res,
          "VALID_DATA_TYPE",
          "'product_id' & 'discount'"
        );
      }
      break;
    case "bxgy":
      if (!buy_products || !get_products || !repitition_limit) {
        return customErrorMessages(
          res,
          "REQUIRED",
          "'buy_products', 'get_products' & 'repitition_limit'",
          "BxGy Coupons"
        );
      }
      if (
        typeof repitition_limit !== "number" ||
        !Array.isArray(buy_products) ||
        !Array.isArray(get_products)
      ) {
        return customErrorMessages(res, "MIX_OF_VALID_DATA_TYPE");
      }
      for (const item of buy_products) {
        const { product_id, quantity } = item;
        if (!product_id || !quantity) {
          return customErrorMessages(
            res,
            "EACH_ITEM_REQUIRED",
            "'product_id' & 'quantity'",
            "details.buy_products"
          );
        }
        if (typeof product_id !== "number" || typeof quantity !== "number") {
          return customErrorMessages(
            res,
            "VALID_DATA_TYPE",
            "'product_id' & 'quantity'",
            "details.buy_products"
          );
        }
      }
      for (const item of get_products) {
        const { product_id, quantity } = item;
        if (!product_id || !quantity) {
          return customErrorMessages(
            res,
            "EACH_ITEM_REQUIRED",
            "'product_id' & 'quantity'",
            "details.get_products"
          );
        }
        if (typeof product_id !== "number" || typeof quantity !== "number") {
          return customErrorMessages(
            res,
            "VALID_DATA_TYPE",
            "'product_id' & 'quantity'",
            "details.get_products"
          );
        }
      }
      break;
    default:
      return customErrorMessages(res, "INVALID_COUPON_TYPE");
  }

  next();
};

export { validateCoupons };
