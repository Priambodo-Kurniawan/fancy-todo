var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth')
var user = require('../controllers/userController')

router.post('/login', auth.login);
router.post('/login-fb', auth.loginFB);

router.post('/signup', auth.signup)

router.delete('/:id', auth.authUser, user.remove)

router.put('/:id', auth.authUser, user.update)

router.get('/', user.findAll)
router.get('/:id', auth.authUser, user.getOne)

module.exports = router;
