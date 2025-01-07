const createNewCoupons = async (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("Good");
};

const getAllCoupons = async (req, res) => {
  console.log(req.query);
  res.send({
    coupons: [
      { item: "1", value: "$69" },
      { item: "2", value: "$420" },
    ],
  });
};

const getSpecificCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (id === "234") {
    res.send("Good");
  } else {
    res.status(400).json({ message: `${id} is not "234"` });
  }
};

const updateSpecificCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send(`Coupon with ID: ${id} is updated`);
};

const deleteSpecificCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send(`Coupon with ID: ${id} is deleted successfully!`);
};

export {
  createNewCoupons,
  getAllCoupons,
  getSpecificCoupon,
  updateSpecificCoupon,
  deleteSpecificCoupon,
};
