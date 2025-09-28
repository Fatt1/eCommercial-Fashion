import { FEE_SHIPPING } from "../constant/Constant.js";

import Order from "../models/Order.js";
import { createOrder } from "./orderService.js";
import { getDetailOneSku, getProductById } from "./productService.js";
import { applyCoupon } from "./discountService.js";
import { getTickedProductInCart } from "./cartService.js";
function checkoutPreview(discountId = null) {
  const cart = getTickedProductInCart();
  console.log(cart);
  const checkoutOrder = {
    totalPrice: 0, // Tổng tiền hàng
    feeShipping: 0,
    totalDiscount: 0,
    totalCheckout: 0, // Tổng tiền phải thanh toán
    itemsCheckout: [],
    totalItems: 0,
  };

  // lấy thông tin về sản phẩm
  for (const cartItem of cart) {
    const product = getProductById(cartItem.productId);

    // Lấy ra sku đang đc chọn
    const sku = product.skus.find((s) => s.id === cartItem.skuId);

    // Tính giá thô (nhân số lượng), giá thành tiền
    const rawPrice = cartItem.quantity * product.priceInfo.currentlyPrice;
    let detailSku = getDetailOneSku(sku, product.id);
    checkoutOrder.itemsCheckout.push({
      item: {
        productId: product.id,
        detailSku,
        productName: product.name,
        originalPrice: product.priceInfo.originalPrice,
        currentlyPrice: product.priceInfo.currentlyPrice,
        image: product.thumbnail,
      },
      rawPrice,
      quantity: cartItem.quantity,
    });
    checkoutOrder.totalPrice += rawPrice;
  }
  checkoutOrder.totalItems = checkoutOrder.itemsCheckout.length;

  // Tính tiền nếu có mã giảm giá
  if (discountId) {
    const totalDiscount = applyCoupon(discountId, checkoutOrder.totalPrice);
    checkoutOrder.totalDiscount += totalDiscount;
  }

  checkoutOrder.feeShipping = FEE_SHIPPING;

  checkoutOrder.totalCheckout +=
    checkoutOrder.totalPrice -
    checkoutOrder.totalDiscount +
    checkoutOrder.feeShipping;
  return checkoutOrder;
}
function checkout(
  checkoutOrder,
  customerId,
  street,
  city,
  ward,
  district,
  paymentMethodId
) {
  const { checkoutItems } = checkoutOrder;
  const items = checkoutItems.map((checkout) => {
    return {
      productId: checkout.item.productId,
      name: checkout.item.productName,
      quantity: checkout.quantity,
      originalPrice: checkout.item.originalPrice,
      price: checkout.item.currentlyPrice,
    };
  });
  //call API thanh toán tiền gì đó

  // sau khi thanh toán thành công thì sẽ tạo order mới

  const order = createOrder({
    customerId,
    street,
    city,
    ward,
    district,
    feeShipping: checkoutOrder.feeShipping,
    items: items,
    paymentMethodId,
    total: checkoutOrder.totalCheckout,
    totalApplyDiscount: checkoutOrder.totalDiscount,
  });
}
export { checkoutPreview };
console.log(checkoutPreview());
