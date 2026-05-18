const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
const db = new sqlite3.Database('./app_database.sqlite');

db.serialize(() => {
  // Table for temporary OTPs
  db.run("CREATE TABLE IF NOT EXISTS otps (phone TEXT PRIMARY KEY, otp TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  
  // Table for registered users
  db.run("CREATE TABLE IF NOT EXISTS users (phone TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Endpoint: Send OTP
app.post('/api/send-otp', (req, res) => {
  const { phone } = req.body;
  if(!phone || phone.length < 10) return res.status(400).json({success: false, message: "Valid phone number required"});
  
  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  db.run("INSERT OR REPLACE INTO otps (phone, otp) VALUES (?, ?)", [phone, otp], (err) => {
    if(err) {
      console.error(err);
      return res.status(500).json({success: false, message: "Database Error"});
    }
    
    console.log(`\n=============================================`);
    console.log(`📱 MOCK SMS GATEWAY`);
    console.log(`Sending message to: ${phone}`);
    console.log(`Message: "Your AgriAI OTP is: ${otp}"`);
    console.log(`=============================================\n`);
    
    res.json({success: true, message: "OTP saved to database and sent via SMS gateway.", otp: otp});
  });
});

// Endpoint: Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  if(!phone || !otp) return res.status(400).json({success: false, message: "Phone and OTP required"});

  db.get("SELECT otp FROM otps WHERE phone = ?", [phone], (err, row) => {
    if(err) return res.status(500).json({success: false, message: "Database Error"});
    
    if(!row || row.otp !== otp) {
      return res.status(400).json({success: false, message: "Invalid or expired OTP"});
    }
    
    // OTP is valid!
    db.run("INSERT OR IGNORE INTO users (phone) VALUES (?)", [phone]);
    db.run("DELETE FROM otps WHERE phone = ?", [phone]); // Delete used OTP
    
    console.log(`✅ User ${phone} logged in successfully!`);
    
    res.json({success: true, message: "Login successful!"});
  });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================`);
  console.log(`🚀 AgriAI Backend Server Running!`);
  console.log(`📂 Database: app_database.sqlite`);
  console.log(`🔗 API is listening on port ${PORT}`);
  console.log(`=============================================`);
});
