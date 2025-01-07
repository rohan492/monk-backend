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

const getAllCoupons = async (_req, res) => {
  try {
    const getQuery = `
      SELECT * FROM coupons ORDER BY id DESC
    `;

    const coupons = await sql(getQuery);

    res.json(coupons);
  } catch (error) {
    console.error("Error getting all coupons:", error);
    res.status(500).send("Error getting all coupons");
  }
};

const getSpecificCoupon = async (req, res) => {
  try {
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
      res
        .status(404)
        .json({ message: `Coupon with ID: ${id} does not exist!` });
    }
  } catch (error) {
    console.error("Error getting specific coupon:", error);
    res.status(500).send("Error getting specific coupon");
  }
};

const updateSpecificCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const { type, details } = req.body;
    const updateQuery = `
      UPDATE coupons 
      SET type = $1, details = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await sql(updateQuery, [type, details, id]);
    const updateLength = result?.length;
    if (updateLength === 0) {
      res
        .status(404)
        .json({ message: `Coupon with ID: ${id} does not exist!` });
    } else {
      res.json({
        message: `Coupon with ID: ${id} is updated successfully!`,
        updated_coupon: result,
      });
    }
  } catch (error) {
    console.error("Error updating specific coupon:", error);
    res.status(500).send("Error updating specific coupon");
  }
};

const deleteSpecificCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleteQuery = `
      DELETE FROM coupons WHERE id = $1 RETURNING *
    `;
    const result = await sql(deleteQuery, [id]);
    const deleteLength = result?.length;
    if (deleteLength === 0) {
      res
        .status(404)
        .json({ message: `Coupon with ID: ${id} does not exist!` });
    } else {
      res.json({
        message: `Coupon with ID: ${id} is deleted successfully!`,
        deleted_coupon: result,
      });
    }
  } catch (error) {
    console.error("Error deleting specific coupon:", error);
    res.status(500).send("Error deleting specific coupon");
  }
};

export {
  createNewCoupons,
  getAllCoupons,
  getSpecificCoupon,
  updateSpecificCoupon,
  deleteSpecificCoupon,
};
