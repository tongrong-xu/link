// routes/TeacherRoute.js
const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/TeacherController');
const auth = require('../middlewares/auth');

router.get('/', TeacherController.viewStudents);
router.post('/approve/:studentId', auth.requireLogin, TeacherController.approveStudent);
router.post('/cancel/:studentId', auth.requireLogin, TeacherController.cancelRegistration);
router.post('/createClassroom', auth.requireLogin, TeacherController.createClassroom);

module.exports = router;