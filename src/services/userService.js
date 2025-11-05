import { generateUniqueId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";

await loadDataToLocalStorage();
function getUserById(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  return user;
}
export function getUserByEmail(userEmail) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.email === userEmail);
  return user;
}
function checkAvailableAddressUser() {
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  if (loggedUser.addresses.length === 0) return false;
  return true;
}
function addNewAddress({
  userId,
  street,
  fullName,
  district,
  ward,
  city,
  phoneNumber,
}) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  const isDefault = user.addresses.length === 0 ? true : false;
  const id = generateUniqueId();
  const newAddress = {
    id,
    street,
    district,
    ward,
    city,
    isDefault,
    fullName,
    phoneNumber,
  };
  user.addresses.push(newAddress);
  saveDbContextToLocalStorage(dbContext);
  localStorage.setItem("user_info", JSON.stringify(user));
}
function getDefaultAddress(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  const address = user.addresses.find((ad) => ad.isDefault === true);
  return address;
}
function getLoggedUser() {
  const user = JSON.parse(localStorage.getItem("user_info"));
  return user;
}

function resetPasswordUser(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  if (user) {
    user.password = "123456"; // Mật khẩu mặc định mới
    saveDbContextToLocalStorage(dbContext);
    return true;
  }
  return false;
}
function blockUser(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  if (user) {
    user.status = "blocked";
    saveDbContextToLocalStorage(dbContext);
    return true;
  }
  return false;
}
function unBlockUser(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  if (user) {
    user.status = "active";
    saveDbContextToLocalStorage(dbContext);
    return true;
  }
  return false;
}
function getAllUsers() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.users;
}

// Cập nhật thông tin người dùng
function updateUserInfo(userId, updatedData) {
  const dbContext = getDbContextFromLocalStorage();
  const user = dbContext.users.find((u) => u.id === userId);
  
  if (!user) {
    return { successful: false, message: "Không tìm thấy người dùng" };
  }

  // Cập nhật các trường thông tin
  if (updatedData.fullName !== undefined) user.fullName = updatedData.fullName;
  if (updatedData.phoneNumber !== undefined) user.phoneNumber = updatedData.phoneNumber;
  if (updatedData.gender !== undefined) user.gender = updatedData.gender;
  if (updatedData.dateOfBirth !== undefined) user.dateOfBirth = updatedData.dateOfBirth;

  // Lưu vào database
  saveDbContextToLocalStorage(dbContext);
  
  // Cập nhật localStorage user_info
  localStorage.setItem("user_info", JSON.stringify(user));
  
  return { successful: true, message: "Cập nhật thông tin thành công", data: user };
}

export {
  getUserById,
  checkAvailableAddressUser,
  getDefaultAddress,
  addNewAddress,
  getLoggedUser,
  getAllUsers,
  blockUser,
  unBlockUser,
  resetPasswordUser,
  updateUserInfo,
};
