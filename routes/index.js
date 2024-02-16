// FILE COMPLETE
const router = require('express').Router();

// Import all API routes from /api/index.js
const apiRoutes = require('./api');

// Add `/api` prefix to all API routes imported from the `api` directory
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).send('404 Error!');
});

module.exports = router;