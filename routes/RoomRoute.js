// 匯入所需模組
const express = require("express"); // 引入 Express 框架
const router = express.Router(); // 建立路由器
const RoomController = require("../controllers/RoomController"); // 引入教室控制器
const auth = require("../middlewares/auth"); // 引入自訂的驗證中介軟體

// 建立教室 (教師)
router.post("/create", auth.requireLogin, RoomController.createRoom); // 路由處理 POST 請求到 '/create' 路徑，並使用驗證中介軟體檢查使用者登入狀態和角色，最後由教室控制器處理建立教室的請求

// 查看教室 (教師和學生)
router.get("/:roomId", auth.requireLogin, RoomController.viewClassroom); // 路由處理 GET 請求到 '/:roomId' 路徑，並使用驗證中介軟體檢查使用者登入狀態，最後由教室控制器處理查看教室的請求

// 加入教室 (學生)
router.post('/join', auth.requireLogin, auth.requireStudent, RoomController.joinRoom); // 路由處理 POST 請求到 '/join' 路徑，並使用驗證中介軟體檢查使用者登入狀態和角色，最後由教室控制器處理加入教室的請求

// 查看教師建立的教室列表
router.get("/teacher/:teacherId", auth.requireLogin, RoomController.viewRoomsByTeacher); // 路由處理 GET 請求到 '/teacher/:teacherId' 路徑，並使用驗證中介軟體檢查使用者登入狀態，最後由教室控制器處理查看教師建立的教室列表的請求

module.exports = router; // 匯出路由器