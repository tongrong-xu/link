// 匯入模型
const User = require("../models/user"); // 使用者模型
const Room = require("../models/room"); // 教室模型
const {
    generateRoomCode
} = require("../utils/helpers"); // 匯入幫助程式中的 generateRoomCode 函式

// 查看所有學生的處理函式
const viewStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: "student"
        }); // 查詢所有角色為學生的使用者
        const teacher = await User.find({
            role: "teacher"
        });
        res.render("teacher", {
            teacher,
            students
        }); // 渲染 'teacher' 樣板並傳遞學生資料
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
    }
};

// 審核學生註冊的處理函式
const approveStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId; // 從 URL 參數中取得學生 ID

        // 根據 studentId 查詢學生資料
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: '找不到學生!'
            }); // 若學生不存在，回傳 404 錯誤
        }

        // 更新學生註冊狀態為approved
        student.status = 'approved';
        await student.save();

        res.redirect('/teacher'); // 重新導向到教師頁面
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
    }
};

// 取消學生註冊的處理函式
const cancelRegistration = async (req, res) => {
    try {
        const studentId = req.params.studentId; // 從 URL 參數中取得學生 ID

        // 根據 studentId 查詢學生資料
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: '找不到學生!'
            }); // 若學生不存在，回傳 404 錯誤
        }

        // 更新學生註冊狀態為rejected
        student.status = 'rejected';
        await student.save();

        res.redirect('/teacher'); // 重新導向到教師頁面
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
    }
};

// 取得教師用戶的 ID 的處理函式
const getTeacherId = async () => {
    try {
        // 假設這裡的條件可以辨識出教師用戶，比如使用 'teacher' 作為教師的角色
        const teacherUser = await User.findOne({
            role: 'teacher'
        });
        return teacherUser._id; // 返回教師用戶的 ID
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
        return null;
    }
};

// 建立教室的處理函式
const createClassroom = async (req, res) => {
    try {
        const teacherId = req.session.user._id; // 從 session 取得目前使用者的教師 ID
        const roomCode = generateRoomCode(); // 實作產生教室代碼的函式

        const room = new Room({
            code: roomCode, // 設定教室的代碼
            teacher: teacherId, // 設定教室的教師
        });

        await room.save(); // 儲存新建立的教室到資料庫

        // 獲取所有學生，以便在教室頁面顯示
        const students = await User.find({
            role: 'student'
        });

        // 傳遞教室代碼和學生列表到教室頁面
        res.render('classroom', {
            roomCode,
            students
        });
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
    }
};

// 查看所有教室的處理函式
const viewClassrooms = async (req, res) => {
    try {
        const teacherId = req.session.user._id; // 從 session 取得目前使用者的教師 ID
        // 查詢教師創建的所有教室
        const classrooms = await Room.find({
            teacher: teacherId
        });

        // 透過教室列表顯示教室代碼和相關操作按鈕
        res.render('classroom_list', {
            classrooms
        });
    } catch (error) {
        console.log(error.message); // 若有錯誤，輸出錯誤訊息到控制台
    }
};

module.exports = {
    viewStudents, // 查看所有學生的處理函式
    approveStudent, // 審核學生註冊的處理函式
    cancelRegistration, // 取消學生註冊的處理函式
    getTeacherId, // 取得教師 ID 的處理函式
    createClassroom, // 建立教室的處理函式
    viewClassrooms, // 查看所有教室的處理函式
};