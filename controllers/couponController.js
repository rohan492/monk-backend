import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const createNewCoupons = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.query);

    const { type, details } = req.body;

    const insertQuery = `
      INSERT INTO coupons (type, details)
      VALUES ($1, $2::jsonb)
      RETURNING *;
    `;

    const result = await sql(insertQuery, [type, details]);

    const insertedCoupon = result?.[0];
    res.json(insertedCoupon);
  } catch (error) {
    console.error("Error inserting coupon:", error);
    res.status(500).send("Error inserting coupon");
  }
};

const getAllCoupons = async (req, res) => {
  const getQuery = `
    SELECT * from coupons ORDER BY id desc
  `;

  const result = await sql(getQuery);

  const coupons = result;
  res.json(coupons);
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
  console.log(req.body);
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
