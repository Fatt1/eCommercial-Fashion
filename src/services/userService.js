import {
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";

const dbContext = await getDbContextFromLocalStorage();
function getUserById(userId) {
  const user = dbContext.users.find((u) => u.id === userId);
  return user;
}
function checkAvailableAddressUser() {
  const loggedUser = JSON.parse(localStorage.getItem("user-info"));
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
  const user = dbContext.users.find((u) => u.id === userId);
  const newAddress = { street, district, ward, city, isDefault: true };
  user.fullName = fullName;
  user.addresses.push(newAddress);
  user.phoneNumber = phoneNumber;
  saveDbContextToLocalStorage(dbContext);
  localStorage.setItem("user_info", JSON.stringify(user));
}
function getDefaultAddress(userId) {
  const user = dbContext.users.find((u) => u.id === userId);
  const address = user.addresses.find((ad) => ad.isDefault === true);
  return address;
}
export {
  getUserById,
  checkAvailableAddressUser,
  getDefaultAddress,
  addNewAddress,
};
