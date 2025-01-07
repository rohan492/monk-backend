/*
    Cart Items must be formatted as the following:
        {
            "cart": {
                "items": [
                    {"product_id": 1, "quantity": 6, "price": 50},
                    {"product_id": 2, "quantity": 3, "price": 30},
                    {"product_id": 3, "quantity": 2, "price": 25}
                ]
            }
        }      
*/

import { customErrorMessages } from "../utils/couponValidationHelpers.js";

const validateCartItems = async (req, res, next) => {
  console.log(req.body);
  const { cart } = req.body;
  if (!cart) {
    return customErrorMessages(
      res,
      "INVALID_KEYS",
      "'cart'",
      null,
      "Cart Items"
    );
  }

  const { items } = cart;
  if (!items) {
    return customErrorMessages(
      res,
      "INVALID_KEYS",
      "'cart.items'",
      null,
      "Cart Items"
    );
  }

  if (!Array.isArray(items)) {
    return customErrorMessages(res, "ARRAY_OF_OBJECTS");
  }

  for (const item of items) {
    const { product_id, quantity, price } = item;
    if (!product_id || !quantity || !price) {
      return customErrorMessages(
        res,
        "EACH_ITEM_REQUIRED",
        "'product_id', 'quantity' & 'price'",
        "cart.items"
      );
    }
    if (
      typeof product_id !== "number" ||
      typeof quantity !== "number" ||
      typeof price !== "number"
    ) {
      return customErrorMessages(
        res,
        "VALID_DATA_TYPE",
        "'product_id', 'quantity' & 'price'",
        "cart.items"
      );
    }
  }

  next();
};

export { validateCartItems };
