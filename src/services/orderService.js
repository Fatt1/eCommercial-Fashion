import { ORDER_STATUS } from "../constant/Constant.js";
import { createPagination, generateOrderId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import Order from "../models/Order.js";
await loadDataToLocalStorage();
function createOrder({
  customerId,
  items,
  totalApplyDiscount,
  totalCheckout,
  totalPrice,
  street,
  city,
  ward,
  district,
  feeShipping,
  paymentMethodId,
  fullName,
  phoneNumber,
}) {
  const dbContext = getDbContextFromLocalStorage();
  const id = generateOrderId();
  const order = new Order(
    id,
    customerId,
    items,
    totalApplyDiscount,
    totalCheckout,
    totalPrice,
    street,
    city,
    ward,
    district,
    feeShipping,
    paymentMethodId,
    ORDER_STATUS.WAITING_FOR_PAYMENT,
    fullName,
    phoneNumber
  );

  dbContext.orders.push(order);
  saveDbContextToLocalStorage(dbContext);

  return order;
}
function updateStatusOrder(orderId, status) {
  const dbContext = getDbContextFromLocalStorage();
  const order = dbContext.orders.find((o) => o.id === orderId);
  order.status = status;
  saveDbContextToLocalStorage(dbContext);
}
// Lọc đơn hàng theo các tiêu chí
function filterOrdersByAdmin({
  pageSize = 10,
  pageNumber = 1,
  status,
  searchKey,
  startDate,
  endDate,
}) {
  const dbContext = getDbContextFromLocalStorage();
  let filteredOrders = [...dbContext.orders];

  // Lọc theo trạng thái
  if (status) {
    filteredOrders = filteredOrders.filter((o) => o.status === status);
  }

  // Lọc theo từ khóa tìm kiếm (ID đơn hàng, tên khách hàng, SĐT)
  if (searchKey) {
    const lowerCaseSearchKey = searchKey.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(lowerCaseSearchKey) ||
        o.fullName.toLowerCase().includes(lowerCaseSearchKey) ||
        o.phoneNumber.includes(lowerCaseSearchKey)
    );
  }

  // Lọc theo khoảng thời gian
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    filteredOrders = filteredOrders.filter(
      (o) => new Date(o.createdAt) >= start
    );
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filteredOrders = filteredOrders.filter((o) => new Date(o.createdAt) <= end);
  }

  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return createPagination(filteredOrders, pageSize, pageNumber);
}
// Lấy chi tiết đơn hàng theo id
function getOrderDetailById(orderId) {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.orders.find((o) => o.id === orderId);
}
// Lấy tất cả đơn hàng của một user
function getAllOrdersByUserId(userId) {
  const dbContext = getDbContextFromLocalStorage();
  const orders = dbContext.orders.filter((o) => o.customerId === userId);
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return orders;
}

// Lấy đơn hàng của một user theo trạng thái
function getOrdersUserIdByStatus(userId, status) {
  // Sử dụng ORDER_STATUS để xem trạng thái phù hợp với giao diện
  // Ví dụ: Đang chờ xác nhận -> PENDING
  const dbContext = getDbContextFromLocalStorage();

  let orders = null;
  if (!status) {
    orders = dbContext.orders.filter((o) => o.customerId === userId);
  } else {
    orders = dbContext.orders.filter(
      (o) => o.customerId === userId && o.status === status
    );
  }
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return orders;
}

export {
  createOrder,
  updateStatusOrder,
  getAllOrdersByUserId,
  getOrdersUserIdByStatus,
  filterOrdersByAdmin,
  getOrderDetailById,
};
