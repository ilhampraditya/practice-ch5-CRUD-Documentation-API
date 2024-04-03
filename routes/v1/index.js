const router = require("express").Router()
const Pool = require("pg").Pool
const pool = new Pool({
  database: "practice4",
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "ilham123",
})

router.get("/", (req, res) => {
  res.send("hello world!")
})

// get all students
router.get("/students", async (req, res) => {
  let students = await pool.query("SELECT * FROM students")
  res.send(students.rows)
})

// get students details
router.get("/students/:id", async (req, res) => {
  let id = req.params.id
  let students = await pool.query("SELECT * FROM students WHERE id = $1", [id])
  if (students.rows.length === 0) {
    return res.status(404).json({
      status: false,
      message: "Student not found",
    })
  }
  res.status(200).json({
    status: true,
    message: "Success",
    data: students.rows[0],
  })
})

//create students
router.post("/students", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.age ||
      !req.body.address ||
      !req.body.is_active
    ) {
      return res.status(400).json({
        status: false,
        message: "failed!",
      })
    }

    let name = req.body.name
    let age = req.body.age
    let address = req.body.address
    let is_active = req.body.is_active

    let students = await pool.query(
      "INSERT INTO students (name, age, address, is_active) values ($1, $2, $3, $4)",
      [name, age, address, is_active]
    )

    res.status(201).json({
      status: true,
      message: "success",
      data: students.rowCount,
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Body must be required!",
    })
  }
})

//update students
router.put("/students/:id", async (req, res) => {
  try {
    let id = req.params.id
    let name = req.body.name
    let age = req.body.age
    let address = req.body.address
    let is_active = req.body.is_active

    let result = await pool.query(
      "UPDATE students SET name=$1, age=$2, address=$3, is_active=$4 WHERE id=$5",
      [name, age, address, is_active, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "failed!",
      })
    }

    let updatedStudent = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    )

    res.status(200).json({
      status: true,
      message: "success",
      data: updatedStudent.rows[0],
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "failed!",
    })
  }
})

// delete students
router.delete("/students/:id", async (req, res, next) => {
  try {
    let id = req.params.id

    let result = await pool.query("DELETE FROM students WHERE id=$1", [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "failed!",
      })
    }

    res.status(200).json({
      status: true,
      message: "success",
      data: null,
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "failed!",
    })
  }
})

module.exports = router
