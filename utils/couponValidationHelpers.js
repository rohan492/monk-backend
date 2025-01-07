const customErrorMessages = (
  res,
  typeOfError,
  required_keys,
  required_name
) => {
  let errorMessage;
  switch (typeOfError) {
    case "NO_TYPE_AND_DETAILS":
      errorMessage = `Coupons must contain a type & relevant details`;
      break;
    case "INVALID_COUPON_TYPE":
      errorMessage = `Please provide a valid coupon type. Valid types are 'cart-wise', 'product-wise' and 'bxgy'`;
      break;
    case "EACH_ITEM_REQUIRED":
      errorMessage = `Each item of ${required_name} must have ${required_keys}`;
      break;
    case "REQUIRED":
      errorMessage = `${required_name} must have ${required_keys}`;
      break;
    case "MIX_OF_VALID_DATA_TYPE":
      errorMessage = `Please provide numerical value for repition_limit & respective arrays for buy_products & get_products`; // Only 1 case for now. Can modularize this too in future
      break;
    case "VALID_DATA_TYPE":
      errorMessage = `Please provide numerical values for ${required_keys}${
        required_name ? ` of ${required_name}` : ""
      }`;
      break;
    default:
      errorMessage = "There was an error validating your inputs";
  }

  return res.status(400).json({ error: errorMessage });
};

export { customErrorMessages };
