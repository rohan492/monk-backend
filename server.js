import express from "express";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`Hello World! My Super Secret is: ${process.env.SUPER_SECRET}`);
});

app.listen(PORT || 3000, () => {
  console.log("Listening on PORT: ", PORT);
});
