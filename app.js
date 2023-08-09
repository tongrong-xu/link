require("dotenv").config();
// 載入並設定環境變數

//const createError = require('http-errors'); 

var mongoose = require("mongoose");
// 引入 mongoose 模組

mongoose.connect('mongodb://127.0.0.1:27017/link');
// 連接到 MongoDB 資料庫

const app = require('express')();

const express = require('express');
// 建立 Express 應用程式實例

const http = require('http').Server(app);
// 建立 HTTP 伺服器實例，並將 Express 應用程式作為參數傳入

const UserRoute = require('./routes/UserRoute');
// 引入使用者路由模組（UserRoute）

app.set('view engine', 'ejs'); // 設定模板引擎為ejs
app.set('views', './views'); // 設定模板的存放目錄為./views

app.use(express.static('public')); // 設定靜態資源的路徑為public目錄

const TeacherRoute = require("./routes/TeacherRoute"); // 處理教師相關操作的路由
const RoomRoute = require("./routes/RoomRoute"); // 處理教室相關操作的路由

app.use("/teacher", TeacherRoute); // 路由處理器對應到 '/teacher' 路徑
app.use("/room", RoomRoute); // 路由處理器對應到 '/room' 路徑
app.use('/', UserRoute);
// 將使用者路由模組套用到根路徑

const io = require('socket.io')(http);

var usp = io.of('/user-namesapce');

usp.on('connection', function (socket) {
    console.log("user connected");

    socket.on('disconnect', function () {
        console.log('user disconnected');
    })

});

http.listen(8000, () => console.log("Server started on port"));
// 啟動伺服器監聽指定的埠號（8000），並在啟動後顯示訊息

module.exports = app;
// 匯出 Express 應用程式實例，以便在其他檔案中引入和使用該應用程式