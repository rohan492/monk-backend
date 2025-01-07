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
    SELECT * FROM coupons ORDER BY id DESC
  `;

  const result = await sql(getQuery);

  const coupons = result;
  res.json(coupons);
};

const getSpecificCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const searchQuery = `
    SELECT * FROM coupons WHERE id = $1
  `;

  const result = await sql(searchQuery, [id]);

  const foundCoupon = result?.[0];

  if (foundCoupon) {
    res.json(foundCoupon);
  } else {
    res.status(404).json({ message: `Coupon with ID: ${id} does not exist!` });
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
