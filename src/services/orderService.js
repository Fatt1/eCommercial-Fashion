import { ORDER_STATUS } from "../constant/Constant.js";
import { generateOrderId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import Order from "../models/Order.js";

async function createOrder({
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
}) {
  const dbContext = await getDbContextFromLocalStorage();
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
    ORDER_STATUS.PENDING
  );

  dbContext.orders.push(order);
  console.log(dbContext);
  saveDbContextToLocalStorage(dbContext);

  return order;
}
async function updateStatusOrder(orderId, status) {
  const dbContext = await getDbContextFromLocalStorage();
  const order = dbContext.orders.find((o) => o.id === orderId);
  order.status = status;
  saveDbContextToLocalStorage(dbContext);
}

export { createOrder, updateStatusOrder };
