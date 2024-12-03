const express = require('express');
const { createAdmin } = require('../controllers/adminCtrl'); // Import the controller
const router = express.Router();

router.post('/create-admin', createAdmin); // Define the POST route

module.exports = router;

router.get('/test', (req, res) => {
    res.send('Admin route is working');
});
  
console.log('Inside adminRoutes');
router.post('/create', (req, res) => {
  console.log('POST /create hit');
  res.send('Test Create Admin');
});
