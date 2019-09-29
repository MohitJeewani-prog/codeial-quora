const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

//by adding passport.checkAuthantication, no user can edit html by creating
//a form than posting a post
router.post('/create', passport.checkAuthentication, postsController.create);

module.exports = router;