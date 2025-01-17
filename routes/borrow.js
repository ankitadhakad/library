const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

router.get('/overdue/:memberId', borrowController.getOverdueBooks);
router.post('/', borrowController.addBorrowRecord);
router.put('/:id/return', borrowController.markAsReturned);

module.exports = router;
