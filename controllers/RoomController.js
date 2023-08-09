// 匯入模型
const Room = require("../models/room"); // 教室模型
const User = require("../models/user"); // 使用者模型
const {
  generateRoomCode
} = require("../utils/helpers"); // 匯入幫助程式中的 generateRoomCode 函式

// 建立教室的處理函式
const createRoom = async (req, res) => {
  try {
    const teacherId = req.session.user._id; // 從 session 取得目前使用者的教師 ID
    const roomCode = generateRoomCode(); // 生成教室代碼

    const room = new Room({
      code: roomCode, // 設定教室的代碼
      teacher: teacherId, // 設定教室的教師
    });

    await room.save(); // 儲存新建立的教室到資料庫
    res.redirect(`/room/${room._id}`); // 重新導向到新建立的教室頁面
  } catch (error) {
    console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
  }
};

// 查看教室的處理函式
const viewClassroom = async (req, res) => {
  try {
    const roomId = req.params.roomId; // 從 URL 參數中取得教室 ID
    const room = await Room.findById(roomId); // 根據教室 ID 查詢教室資料

    if (!room) {
      return res.status(404).send("教室不存在"); // 若教室不存在，回傳 404 錯誤
    }

    const isTeacher =
      req.session.user.role === "teacher" && // 檢查使用者是否為教師
      req.session.user._id.toString() === room.teacher.toString(); // 檢查教室的教師是否為目前使用者

    const students = await User.find({
      _id: {
        $in: room.students
      }, // 查詢教室中的學生
    });

    res.render("classroom", {
      room, // 傳遞教室資料到 EJS 模板
      isTeacher, // 傳遞是否為教師到 EJS 模板
      students, // 傳遞學生資料到 EJS 模板
    });
  } catch (error) {
    console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
  }
};

// 加入教室的處理函式
const joinRoom = async (req, res) => {
  try {
    const studentId = req.session.user._id; // 從 session 取得目前使用者的學生 ID
    const roomCode = req.body.roomCode; // 從 POST 資料中取得教室代碼

    const room = await Room.findOne({
      code: roomCode, // 根據教室代碼查詢教室資料
    });
    if (!room) {
      return res.render("student", {
        message: "無效的教室代碼", // 若教室不存在，回傳錯誤訊息到 EJS 模板
      });
    }

    // 檢查學生是否已經在教室中
    if (room.students.includes(studentId)) {
      return res.render("student", {
        message: "您已經加入了該教室", // 若學生已經在教室中，回傳錯誤訊息到 EJS 模板
      });
    }

    room.students.push(studentId); // 將學生加入教室的學生列表
    await room.save(); // 儲存更新後的教室資料到資料庫

    res.redirect(`/room/${room._id}`); // 重新導向到加入的教室頁面
  } catch (error) {
    console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
  }
};

// 查看教師建立的所有教室的處理函式
const viewRoomsByTeacher = async (req, res) => {
  try {
    const teacherId = req.session.user._id; // 從 session 取得目前使用者的教師 ID
    const classrooms = await Room.find({
      teacher: teacherId
    }); // 根據教師 ID 查詢教師建立的所有教室

    res.render("classroom_list", {
      classrooms, // 傳遞教室列表到 EJS 模板
    });
  } catch (error) {
    console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
  }
};

module.exports = {
  createRoom,
  viewClassroom,
  joinRoom,
  viewRoomsByTeacher,
};