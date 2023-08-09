const express = require('express');
const user = express(); // 建立一個Express應用程式實例，代表使用者相關的路由

const bodyParser = require('body-parser'); // 引入body-parser模組，用於解析HTTP請求的body

const session = require('express-session'); // 引入express-session模組，用於管理使用者的session
const {
    sessionSecret
} = process.env; // 從環境變數中獲取session的密鑰

const auth = require('../middlewares/auth'); // 引入自定義的身份驗證中間件防止網址亂導向

// 使用express-session中間件，並設定一些選項
user.use(session({
    secret: sessionSecret, // session的密鑰
    resave: false, // 設定 resave 選項為 false，表示即使session沒有修改也強制保存
    saveUninitialized: false, // 設定 saveUninitialized 選項為 false，表示不保存未初始化的session
}));

user.use(bodyParser.json()); // 使用body-parser中間件解析JSON格式的body
user.use(bodyParser.urlencoded({
    extended: true
})); // 使用body-parser中間件解析URL編碼的body

const path = require('path');
const multer = require('multer');

// 設定multer中間件來處理檔案上傳
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 指定檔案的儲存目錄為public/images
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        // 使用Date.now()加上原始檔案名稱來生成新的檔案名稱，以避免重複
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

// 初始化multer上傳中間件
const upload = multer({
    storage: storage
});

// 引入使用者控制器（UserController）
const UserController = require('../controllers/UserController');

// 定義路由規則和處理函式（控制器方法）

// GET請求處理函式，用於顯示註冊頁面
user.get('/register', auth.requireLogout, UserController.registerload);

// POST請求處理函式，用於處理使用者註冊表單的提交和檔案上傳
user.post('/register', upload.single('image'), UserController.register);

// 
user.get('/', auth.requireLogout, UserController.loadlogin);

// 
user.post('/', UserController.login);

//
user.get('/logout',auth.requireLogin, UserController.logout);

//
user.post('/joinClassroom', auth.requireLogin, UserController.joinClassroom);

//
user.get('/student', auth.requireLogin, UserController.student);

//
user.get('/teacher', auth.requireLogin, UserController.teacher);

//
user.get('*', function (req, res) {
    res.redirect('/');
});

// 導出user應用程式實例，以便在其他檔案中引入和使用該路由
module.exports = user;