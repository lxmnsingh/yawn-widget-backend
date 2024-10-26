const express = require('express');
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/UserController');
const validators = require('../middlewares/validators');
const router = express.Router();

router.post('/', auth, ctrl.saveUser);
router.get('/', auth, ctrl.getUser);
router.post('/click', validators.validateClickSave, auth, ctrl.saveClick);
router.get('/click/:click_id', auth, ctrl.getClick);

module.exports = router;