//this index.js is like ROOT file for routes

const express = require('express');

const router = express.Router();

//import controller
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);

//in order to list all the routes inside routes folder
router.use('/users', require('./users'));

module.exports = router;