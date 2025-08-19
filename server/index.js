const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2');

require('dotenv').config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1', // ← fixed host
  user: 'root',
  password: '123456',
  database: 'voter_db',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('MySQL connected successfully');
  }
});

// Authorization middleware
const authorizeUser = (req, res, next) => {
  const token = req.query.Authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('<h1 align="center"> Login to Continue </h1>');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};

// Login route
app.get('/login', (req, res) => {
  const { voter_id, password } = req.query;

  const query = 'SELECT * FROM voters WHERE voter_id = ? AND password = ?';
  db.query(query, [voter_id, password], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const token = jwt.sign({ voter_id: user.voter_id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    res.json({ token, role: user.role });
  });
});

// ---------- Register new voter ----------
app.post('/register', (req, res) => {
  const { voter_id, role, password } = req.body;

  if (!voter_id || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = 'INSERT INTO voters (voter_id, role, password) VALUES (?, ?, ?)';
  db.query(query, [voter_id, role, password], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Voter ID already exists' });
      }
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(201).json({
      message: 'Voter registered successfully',
      voter: {
        voter_id,
        role
      }
    });
  });
});


// ---------- Get all users ----------
app.get('/users', authorizeUser, (req, res) => {
  const query = 'SELECT voter_id, role FROM voters';
  db.query(query, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
  });
});

// ---------- Update user's role ----------
app.put('/update-role', authorizeUser, (req, res) => {
  const { voter_id, role } = req.body;

  if (!voter_id || !role) {
    return res.status(400).json({ message: 'Missing voter_id or role' });
  }

  const query = 'UPDATE voters SET role = ? WHERE voter_id = ?';
  db.query(query, [role, voter_id], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.json({ message: 'Role updated successfully' });
  });
});



// Static file routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/js/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/login.js'));
});

app.get('/css/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/login.css'));
});

app.get('/css/index.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/index.css'));
});

app.get('/css/admin.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/admin.css'));
});

app.get('/assets/eth5.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/assets/eth5.jpg'));
});

app.get('/js/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/app.js'));
});

app.get('/admin.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});

app.get('/index.html', authorizeUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

app.get('/dist/login.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/login.bundle.js'));
});

app.get('/dist/app.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/app.bundle.js'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
