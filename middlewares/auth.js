const islogin = async (req, res, next) => {
    try {
        if (req.session.user) { // 檢查使用者是否已經登入
            // 使用者已經登入，繼續執行下一個中間件或路由處理函式
            return next(); // 在這裡加上 return，避免繼續執行後續程式碼
        } else {
            // 使用者尚未登入，重新導向到首頁
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const islogout = async (req, res, next) => {
    try {
        if (req.session.user) {
            // 使用者尚未登出，重新導向到學生或教師頁面，根據使用者的角色
            if (req.session.user.role === 'student') {
                return res.redirect('/student');
            } else if (req.session.user.role === 'teacher') {
                return res.redirect('/teacher');
            } else {
                // 假設職業未知時，重新導向到登入頁面
                return res.redirect('/login');
            }
        }
        // 使用者已經登出，繼續執行下一個中間件或路由處理函式
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const requireStudent = (req, res, next) => {
    if(req.session.user && req.session.user.role === 'student') {
      next();
    } else {
      res.status(403).send('Requires student role'); 
    }
  }

  module.exports = {
    requireLogin: islogin, 
    requireLogout: islogout,
    requireStudent  
  }