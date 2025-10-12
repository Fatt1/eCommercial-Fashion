import { ORDER_STATUS } from "../constant/Constant.js";
import { generateOrderId } from "../helper/helper.js";
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

// Lấy tất cả đơn hàng của một user
function getAllOrdersByUserId(userId) {
  // Nhớ sắp xếp theo thời gian giảm dần
}

// Lấy đơn hàng của một user theo trạng thái
function getOrdersUserIdByStatus(userId, status) {
  // Sử dụng ORDER_STATUS để xem trạng thái phù hợp với giao diện
  // Ví dụ: Đang chờ xác nhận -> PENDING
  const pendingStatus = ORDER_STATUS.PENDING;
}

export {
  createOrder,
  updateStatusOrder,
  getAllOrdersByUserId,
  getOrdersUserIdByStatus,
};
