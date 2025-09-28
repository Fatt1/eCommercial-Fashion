import { generateUniqueId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import User from "../models/User.js";
const dbContext = await getDbContextFromLocalStorage();
function login(email, password) {
  const user = dbContext.users.find(
    (c) => c.email === email && c.password === password
  );
  if (!user)
    return {
      successful: false,
      message: "Email hoặc mật khẩu không đúng",
      data: null,
    };
  return { successful: true, message: "Đăng nhập thành công!", data: user };
}
function register(email, password) {
  console.log(dbContext);
  // Kiểm tra xem email đã tồn tại chưa ?
  if (dbContext.users.some((user) => user.email === email)) {
    return {
      successful: false,
      message: "Email đã tồn tại",
      data: null,
    };
  }
  // Nếu email chưa tồn tại thì tạo tài khoản mới
  const id = generateUniqueId();
  const user = new User(id, email, password);
  dbContext.users.push(user);
  saveDbContextToLocalStorage(dbContext);
  return {
    successful: true,
    message: "Tạo tài khoản thành công",
    data: user,
  };
}
function logout(userId) {
  const user = dbContext.users.find((c) => c.id === userId);
  if (user) {
    localStorage.removeItem("user_info");
    return true;
  }
  return false;
}
function isLogin() {
  const user = localStorage.getItem("user_info");
  if (!user) return false;
  return true;
}
export { login, register, logout, isLogin };
