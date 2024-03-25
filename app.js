const express = require("express");
const app = express();
const port = 3000;
const Pool = require("pg").Pool;

const pool = new Pool({
  database: "practice4",
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "ilham123"
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!");
});

// get all students
app.get("/students", async (req, res) => {
  let students = await pool.query("SELECT * FROM students");
  res.send(students.rows);
});

// get students details
app.get("/students/:id", async (req, res) => {
  let id = req.params.id;
  let students = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
  res.send(students.rows);
});

//
app.post("/students", async (req, res) => {
  let name = req.body.name;
  let age = req.body.age;
  let address= req.body.address;
  let is_active = req.body.is_active;

  let students = await pool.query("INSERT INTO students (name, age, address, is_active) values ($1, $2, $3, $4)", [
   name,
   age,
   address,
   is_active
  ]);
  res.json({ data: students.rowCount });
});

app.listen(port, () => {
  console.log("running on port", port);
});
