import { DISCOUNT_TYPE } from "../constant/Constant.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";

await loadDataToLocalStorage();

function checkValidCoupon(discountId, totalRaw) {
  const dbContext = getDbContextFromLocalStorage();
  const existingCouponCode = dbContext.discounts.find(
    (discount) => discount.id === discountId
  );
  if (!existingCouponCode)
    return { successful: false, message: "Không tìm thấy mã giảm giá" };
  // check xem totalPrice có đủ để giảm giá không
  if (existingCouponCode.minDiscountValue > totalRaw)
    return { successful: false, message: "Tổng tiền không đủ để áp mã này" };
  return { successful: true, message: "Áp dụng mã giảm giá hợp lệ" };
}

function applyCoupon(discountId, totalRaw) {
  const dbContext = getDbContextFromLocalStorage();
  const coupon = dbContext.discounts.find(
    (discount) => discount.id === discountId
  );
  let totalDiscount = 0;
  const type = coupon.type;
  if (type === DISCOUNT_TYPE.FIXED_AMOUNT) {
    totalDiscount = totalRaw - coupon.discountValue;
  } else {
    totalDiscount = totalRaw * (coupon.discountValue / 100);
  }
  if (totalDiscount > coupon.maxDiscountValue)
    totalDiscount = coupon.maxDiscountValue;
  return totalDiscount;
}

function getDiscountByCouponCode(couponCode) {
  const dbContext = getDbContextFromLocalStorage();
  const existingCouponCode = dbContext.discounts.find(
    (discount) => discount.couponCode === couponCode
  );
  return existingCouponCode;
}
function getDiscountById(id) {
  const dbContext = getDbContextFromLocalStorage();
  const existingCouponCode = dbContext.discounts.find(
    (discount) => discount.id === id
  );
  return existingCouponCode;
}
function getAllAvailableDiscounts() {
  const dbContext = getDbContextFromLocalStorage();
  const now = new Date();
  const discounts = dbContext.discounts.filter((discount) => {
    const endDate = new Date(discount.endDate);
    return endDate >= now;
  });
  return discounts.map((discount) => {
    const endDate = new Date(discount.endDate);
    const timeDifferenceMs = endDate.getTime() - now.getTime();
    const msInDay = 1000 * 60 * 60 * 24;
    const leftTimeDays = Math.ceil(timeDifferenceMs / msInDay);

    return { ...discount, leftTimeDays: leftTimeDays }; // Số ngày còn lại (dạng số nguyên) };
  });
}

export {
  applyCoupon,
  checkValidCoupon,
  getAllAvailableDiscounts,
  getDiscountById,
  getDiscountByCouponCode,
};
