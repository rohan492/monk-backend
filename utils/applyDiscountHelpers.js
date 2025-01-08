import { getTotal } from "./reduceUtil.js";

const calculateCartTypeDiscount = (details, itemsArray) => {
  const { threshold, discount } = details;
  const totalCartPrice = getTotal(itemsArray, "total_price");
  return totalCartPrice >= threshold ? (totalCartPrice * discount) / 100 : 0;
};

const calculateProductWiseDiscount = (details, itemsArray) => {
  const { product_id, discount } = details;
  let totalDiscount = 0;
  const itemHavingDiscountIndex = itemsArray?.findIndex(
    (item) => item?.product_id === product_id
  );
  console.log({ itemHavingDiscountIndex });
  if (itemHavingDiscountIndex !== -1) {
    totalDiscount =
      (itemsArray?.[itemHavingDiscountIndex]?.total_price * discount) / 100;
    itemsArray[itemHavingDiscountIndex].total_discount = totalDiscount;
    itemsArray[itemHavingDiscountIndex].total_price =
      itemsArray?.[itemHavingDiscountIndex]?.total_price - totalDiscount;
    console.log({ itemsArray, totalDiscount });
  }
  return totalDiscount;
};

const calculateBxGyDiscount = (details, itemsArray) => {
  const { buy_products, get_products, repitition_limit } = details;

  let eligibleSets = 0;
  let totalDiscount = 0;

  buy_products?.forEach((buyProduct) => {
    const eligibleItem = itemsArray?.find(
      (item) => item?.product_id === buyProduct?.product_id
    );
    if (eligibleItem) {
      const setsForThisBuyProduct = Math.floor(
        eligibleItem?.quantity / buyProduct?.quantity
      );
      eligibleSets = Math.max(eligibleSets, setsForThisBuyProduct);
    }
  });

  eligibleSets = Math.min(eligibleSets, repitition_limit);

  get_products?.forEach((getProduct) => {
    const getProductInCartIndex = itemsArray?.findIndex(
      (item) => item?.product_id === getProduct?.product_id
    );
    if (getProductInCartIndex !== -1) {
      totalDiscount +=
        eligibleSets *
        getProduct?.quantity *
        itemsArray?.[getProductInCartIndex]?.price;

      itemsArray[getProductInCartIndex].total_price =
        itemsArray?.[getProductInCartIndex]?.price *
        itemsArray?.[getProductInCartIndex]?.quantity;

      itemsArray[getProductInCartIndex].quantity +=
        eligibleSets * getProduct?.quantity;

      itemsArray[getProductInCartIndex].total_discount = totalDiscount;
    }
  });

  return totalDiscount;
};

const calculateDiscount = (coupon, itemsArray) => {
  let discount = 0;
  switch (coupon?.type) {
    case "cart-wise":
      discount = calculateCartTypeDiscount(coupon?.details, itemsArray);
      break;
    case "product-wise":
      discount = calculateProductWiseDiscount(coupon?.details, itemsArray);
      break;
    case "bxgy":
      discount = calculateBxGyDiscount(coupon?.details, itemsArray);
      break;
    default:
      discount = 0; // Just following best practices
  }
  return discount;
};

export { calculateDiscount };
