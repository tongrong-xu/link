const mongoose = require('mongoose');
// 定義使用者的資料庫模型（User Model）
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // 必填屬性，使用者名稱
    },
    id: {
        type: String,
    },
    email: {
        type: String,
        required: true // 必填屬性，使用者電子郵件
    },
    image: {
        type: String,
        required: true // 必填屬性，使用者頭像圖片的路徑或URL
    },
    passwordHash: {
        type: String,
        required: true // 必填屬性，使用者密碼
    },
    password: {
        type: String,
        required: true // 必填屬性，使用者密碼
    },
    role: {
        type: String,
        required: true // 必填屬性，職業
    },teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true // 自動添加 createdAt 和 updatedAt 欄位
});

// 將 UserSchema 轉為 User Model
module.exports = mongoose.model('User', UserSchema);