import { getDbContextFromLocalStorage } from "../helper/initialData.js";
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
function register(email, password, confirmPassword) {}
function logout(userId) {
  const user = dbContext.users.find((c) => c.id === userId);
  if (user) {
    localStorage.removeItem("user_info");
    return true;
  }
  return false;
}
export { login, register, logout };
