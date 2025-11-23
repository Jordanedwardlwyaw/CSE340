const express = require('express');
const router = express.Router();

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact CSE Motors' });
});

router.post('/contact', (req, res) => {
  // For now, just redirect back to contact page
  res.redirect('/contact');
});

module.exports = router;