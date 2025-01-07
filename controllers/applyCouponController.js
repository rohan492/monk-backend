const applyCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send(
    `Apply a specific coupon to the cart and return the updated cart with discounted prices for each item. The passed ID is ${id}`
  );
};

export { applyCoupon };
