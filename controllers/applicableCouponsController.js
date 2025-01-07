const applicableCoupons = async (req, res) => {
  console.log(req.body);
  res.send(
    "Fetch all applicable coupons for a given cart and calculate the total discount that will be applied by each coupon."
  );
};

export { applicableCoupons };
