require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());


// CONFIGURATION

const PORT = process.env.PORT || 5000;

const SECRET =
  process.env.JWT_SECRET ||
  'fees-management';


// NEON / POSTGRESQL CONNECTION

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// Test database connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Neon PostgreSQL connected successfully');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });


// AUTH MIDDLEWARE

function auth(req, res, next) {

  try {

    const header =
      req.headers.authorization || '';

    const token =
      header.startsWith('Bearer ')
        ? header.slice(7)
        : '';

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized' });
    }

    req.user = jwt.verify(
      token,
      SECRET
    );

    next();

  } catch (error) {

    return res
      .status(401)
      .json({ error: 'Unauthorized' });

  }
}


// ADMIN MIDDLEWARE

function admin(req, res, next) {

  if (req.user.role !== 'admin') {

    return res
      .status(403)
      .json({
        error: 'Admin access required'
      });

  }

  next();
}


// =====================================================
// LOGIN
// =====================================================

app.post('/api/login', async (req, res) => {

  try {

    const {
      username,
      password
    } = req.body;

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        password,
        role
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    const user = result.rows[0];

    if (
      !user ||
      user.password !== password
    ) {

      return res
        .status(401)
        .json({
          error:
            'Invalid username or password'
        });

    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      SECRET,
      {
        expiresIn: '8h'
      }
    );

    res.json({
      token,

      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res
      .status(500)
      .json({
        error: 'Login failed'
      });

  }

});


// DASHBOARD

app.get(
  '/api/dashboard',
  auth,
  async (req, res) => {

    try {

      const studentsResult =
        await pool.query(`
          SELECT COUNT(*)::int AS count
          FROM students
        `);

      const totalResult =
        await pool.query(`
          SELECT
            COALESCE(SUM(total_fee), 0) AS total
          FROM students
        `);

      const paidResult =
        await pool.query(`
          SELECT
            COALESCE(SUM(amount), 0) AS paid
          FROM payments
        `);

      const students =
        studentsResult.rows[0].count;

      const totalFee =
        Number(totalResult.rows[0].total);

      const paidFee =
        Number(paidResult.rows[0].paid);

      res.json({
        students,
        totalFee,
        paidFee,
        remainingFee:
          totalFee - paidFee
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: 'Unable to load dashboard'
      });

    }

  }
);


// GET ALL STUDENTS

app.get(
  '/api/students',
  auth,
  async (req, res) => {

    try {

      const result = await pool.query(`
        SELECT

          s.id,

          s.name,

          s.roll_no AS "rollNo",

          s.class_name AS "className",

          s.phone,

          s.total_fee AS "totalFee",

          s.created_at AS "createdAt",

          COALESCE(
            (
              SELECT SUM(p.amount)
              FROM payments p
              WHERE p.student_id = s.id
            ),
            0
          ) AS "paidFee",

          s.total_fee -
          COALESCE(
            (
              SELECT SUM(p.amount)
              FROM payments p
              WHERE p.student_id = s.id
            ),
            0
          ) AS "remainingFee"

        FROM students s

        ORDER BY s.id DESC
      `);

      res.json(
        result.rows.map(row => ({
          ...row,
          totalFee: Number(row.totalFee),
          paidFee: Number(row.paidFee),
          remainingFee:
            Number(row.remainingFee)
        }))
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: 'Unable to load students'
      });

    }

  }
);


// ADD STUDENT
app.post(
  '/api/students',
  auth,
  async (req, res) => {

    try {

      const {
        name,
        rollNo,
        className,
        phone,
        totalFee
      } = req.body;

      const result = await pool.query(
        `
        INSERT INTO students
        (
          name,
          roll_no,
          class_name,
          phone,
          total_fee
        )
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
          name,
          rollNo,
          className,
          phone,
          Number(totalFee || 0)
        ]
      );

      res.json({
        id: result.rows[0].id
      });

    } catch (error) {

      console.error(error);

      if (
        error.code === '23505'
      ) {

        return res.status(400).json({
          error:
            'Roll number must be unique'
        });

      }

      res.status(500).json({
        error:
          'Unable to add student'
      });

    }

  }
);


// UPDATE STUDENT

app.put(
  '/api/students/:id',
  auth,
  async (req, res) => {

    try {

      const {
        name,
        rollNo,
        className,
        phone,
        totalFee
      } = req.body;

      await pool.query(
        `
        UPDATE students
        SET
          name = $1,
          roll_no = $2,
          class_name = $3,
          phone = $4,
          total_fee = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        `,
        [
          name,
          rollNo,
          className,
          phone,
          Number(totalFee || 0),
          req.params.id
        ]
      );

      res.json({
        ok: true
      });

    } catch (error) {

      console.error(error);

      if (
        error.code === '23505'
      ) {

        return res.status(400).json({
          error:
            'Roll number must be unique'
        });

      }

      res.status(500).json({
        error:
          'Unable to update student'
      });

    }

  }
);


// DELETE STUDENT
// ADMIN ONLY

app.delete(
  '/api/students/:id',
  auth,
  admin,
  async (req, res) => {

    try {

      await pool.query(
        `
        DELETE FROM students
        WHERE id = $1
        `,
        [req.params.id]
      );

      res.json({
        ok: true
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          'Unable to delete student'
      });

    }

  }
);


// GET STUDENT PAYMENT HISTORY

app.get(
  '/api/students/:id/payments',
  auth,
  async (req, res) => {

    try {

      const result = await pool.query(
        `
        SELECT

          id,

          student_id AS "studentId",

          amount,

          payment_date AS "paymentDate",

          mode,

          note,

          created_at AS "createdAt"

        FROM payments

        WHERE student_id = $1

        ORDER BY
          payment_date DESC,
          id DESC
        `,
        [req.params.id]
      );

      res.json(
        result.rows.map(payment => ({
          ...payment,
          amount: Number(payment.amount)
        }))
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          'Unable to load payment history'
      });

    }

  }
);

// ADD PAYMENT
app.post(
  '/api/students/:id/payments',
  auth,
  async (req, res) => {

    const client =
      await pool.connect();

    try {

      await client.query(
        'BEGIN'
      );

      const studentResult =
        await client.query(
          `
          SELECT
            id,
            total_fee
          FROM students
          WHERE id = $1
          `,
          [req.params.id]
        );

      const student =
        studentResult.rows[0];

      if (!student) {

        await client.query(
          'ROLLBACK'
        );

        return res.status(404).json({
          error:
            'Student not found'
        });

      }

      const amount =
        Number(req.body.amount);

      if (!amount || amount <= 0) {

        await client.query(
          'ROLLBACK'
        );

        return res.status(400).json({
          error:
            'Enter a valid amount'
        });

      }

      const paidResult =
        await client.query(
          `
          SELECT
            COALESCE(SUM(amount), 0) AS paid
          FROM payments
          WHERE student_id = $1
          `,
          [req.params.id]
        );

      const paid =
        Number(
          paidResult.rows[0].paid
        );

      const totalFee =
        Number(student.total_fee);

      if (
        paid + amount > totalFee
      ) {

        await client.query(
          'ROLLBACK'
        );

        return res.status(400).json({
          error:
            `Payment exceeds remaining fee of ₹${(
              totalFee - paid
            ).toFixed(2)}`
        });

      }

      const result =
        await client.query(
          `
          INSERT INTO payments
          (
            student_id,
            amount,
            payment_date,
            mode,
            note
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5
          )
          RETURNING id
          `,
          [
            req.params.id,
            amount,
            req.body.paymentDate ||
              new Date()
                .toISOString()
                .slice(0, 10),
            req.body.mode ||
              'Cash',
            req.body.note ||
              ''
          ]
        );

      await client.query(
        'COMMIT'
      );

      res.json({
        ok: true,
        id: result.rows[0].id
      });

    } catch (error) {

      await client.query(
        'ROLLBACK'
      );

      console.error(error);

      res.status(500).json({
        error:
          'Unable to record payment'
      });

    } finally {

      client.release();

    }

  }
);

// STUDENT FEE SUMMARY

app.get(
  '/api/students/:id/summary',
  auth,
  async (req, res) => {

    try {

      const studentResult =
        await pool.query(
          `
          SELECT

            id,

            name,

            roll_no AS "rollNo",

            class_name AS "className",

            phone,

            total_fee AS "totalFee",

            created_at AS "createdAt"

          FROM students

          WHERE id = $1
          `,
          [req.params.id]
        );

      const student =
        studentResult.rows[0];

      if (!student) {

        return res.status(404).json({
          error: 'Student not found'
        });

      }

      const paidResult =
        await pool.query(
          `
          SELECT
            COALESCE(SUM(amount), 0) AS paid
          FROM payments
          WHERE student_id = $1
          `,
          [req.params.id]
        );

      const paid =
        Number(
          paidResult.rows[0].paid
        );

      const totalFee =
        Number(student.totalFee);

      res.json({
        ...student,

        totalFee,

        paidFee: paid,

        remainingFee:
          totalFee - paid
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          'Unable to load student summary'
      });

    }

  }
);

// START SERVER

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Fees backend running on port ${PORT}`
  );
});