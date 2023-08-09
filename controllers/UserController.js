const Room = require("../models/room");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
    generateRoomCode
} = require("../utils/helpers");
const {
    getTeacherId
} = require('../controllers/TeacherController'); // 引入 bcrypt 模組，用於密碼哈希處理

// 註冊頁面載入處理函式
const registerload = async (req, res) => {
    try {
        res.render('register'); // 渲染註冊頁面
    } catch (error) {
        console.log(error.message);
    }
}

// 註冊處理函式
const register = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.render('register', {
                message: 'Email already registered!'
            });
        }

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        let role = req.body.role;
        let status = 'pending';
        let teacher = null;

        if (role === 'teacher') {
            status = 'approved';
        } else if (role === 'student') {
            // 假設教師的ID存儲在變數"teacherId"中
            teacher = await getTeacherId(); // 轉換為MongoDB物件ID
        }

        const user = new User({
            name: req.body.name,
            email: email,
            id: req.body.id,
            image: 'images/' + req.file.filename,
            passwordHash: passwordHash,
            password: req.body.password,
            role: role,
            status: status,
            teacher: teacher
        });

        await user.save();

        res.redirect('/');

        console.log(user, "通過註冊");
    } catch (error) {
        console.log(error.message);
    }
}

const joinClassroom = async (req, res) => {
    try {
        const studentId = req.session.user._id;
        const roomCode = req.body.roomCode;

        const room = await Room.findOne({
            code: roomCode,
            teacher: req.session.user._id
        });

        if (!room) {
            return res.render("student", {
                message: "無效的教室代碼",
            });
        }


        if (room.students.includes(studentId)) {
            return res.render("student", {
                message: "您已經加入了該教室",
            });
        }

        room.students.push(studentId);
        await room.save();

        res.redirect(`/room/${room._id}`);
    } catch (error) {
        console.log(error.message);
    }
};


// 登入頁面載入處理函式
const loadlogin = async (req, res) => {
    try {
        res.render('login'); // 渲染登入頁面
    } catch (error) {
        console.log(error.message);
    }
}

// 登入處理函式
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({
            email: email,
            password: password
        });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.passwordHash);

            if (passwordMatch) {
                req.session.user = userData;
                if (userData.role === 'student') {
                    console.log("學生登入");
                    res.redirect('/student');
                } else if (userData.role === 'teacher') {
                    console.log("教師登入");
                    res.redirect('/teacher');
                } else {
                    console.error('unknow');
                    res.redirect('/');
                }
            } else {
                res.render('login', {
                    message: 'Email and password are incorrect!'
                });
            }
        } else {
            res.render('login', {
                message: 'Email and password are incorrect!'
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// 登出處理函式
const logout = async (req, res) => {
    try {
        req.session.destroy(); // 清除session
        res.redirect('/'); // 重定向到首頁
        console.log("登出");
    } catch (error) {
        console.log(error.message);
    }
}

const student = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        let message = null;

        if (message === null) {
            message = 'Some message to display';
        }
        res.render('student', {
            user,
            message
        });
    } catch (error) {
        console.log(error.message);
    }
}

const teacher = async (req, res) => {
    try {
        res.render('teacher');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    registerload,
    register,
    loadlogin,
    login,
    logout,
    student,
    teacher,
    joinClassroom
};