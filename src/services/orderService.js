import { ORDER_STATUS } from "../constant/Constant.js";
import { generateOrderId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import Order from "../models/Order.js";
const dbContext = getDbContextFromLocalStorage;
function createOrder({
  customerId,
  items,
  totalApplyDiscount,
  total,
  street,
  city,
  ward,
  district,
  feeShipping,
  paymentMethodId,
}) {
  const id = generateOrderId();
  const order = new Order(
    id,
    customerId,
    items,
    totalApplyDiscount,
    total,
    street,
    city,
    ward,
    district,
    feeShipping,
    paymentMethodId,
    ORDER_STATUS.PENDING
  );
  dbContext.orders.push(order);
  saveDbContextToLocalStorage(dbContext);
  return true;
}

export { createOrder };
