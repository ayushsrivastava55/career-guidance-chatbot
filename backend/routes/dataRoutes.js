const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/colleges', dataController.getColleges);
router.get('/branches', dataController.getBranches);
router.get('/branches/:branchId', dataController.getBranchDetails);

module.exports = router;
