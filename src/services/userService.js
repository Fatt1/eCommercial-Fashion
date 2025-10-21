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

function restPasswordUser(userId, newPassword) {}
function blockUser(userId) {
  // lấy user status ở file Constant.js
}
function unBlockUser(userId) {}
export {
  getUserById,
  checkAvailableAddressUser,
  getDefaultAddress,
  addNewAddress,
  getLoggedUser,
};
