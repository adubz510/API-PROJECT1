// backend/routes/index.js
const express = require('express');
const router = express.Router();

// TESTER ROUTER
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add a CSRF-TOKEN cookie
// When using PostMan do the following:
// Make sure you grab a valid XSRF token by following the route 
// located in the index file OUTSIDE of your routes
// /api/csrf/restore
// Copy that return and apply to ANY and ALL requests made from that point on
// You would add it to the headers in your request area
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

  //connect to api
  const apiRouter = require('./api');

  router.use('/api', apiRouter);


module.exports = router;