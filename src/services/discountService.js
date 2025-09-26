import { DISCOUNT_TYPE } from "../constant/Constant";
import { getDbContextFromLocalStorage } from "../helper/initialData";

const dbContext = getDbContextFromLocalStorage();

function checkValidCoupon(couponCode, totalRaw) {
  const now = new Date();
  const couponCode = dbContext.discounts.find(
    (discount) => discount.couponCode === couponCode
  );
  if (!couponCode)
    return { successful: false, message: "Không tìm thấy mã giảm giá" };
  // check xem totalPrice có đủ để giảm giá không
  if (couponCode.minDiscountValue > totalRaw)
    return { successful: false, message: "Tổng tiền không đủ để áp mã này" };

  if (couponCode.startDate > now || couponCode.endDate < now)
    return {
      successful: false,
      message: "Mã khuyến mãi không trong thời gian sử dụng",
    };
}

function applyCoupon(couponCode, totalRaw) {
  const coupon = dbContext.discounts.find(
    (discount) => discount.couponCode === couponCode
  );
  let totalDiscount = 0;
  const type = coupon.type;
  if (type === DISCOUNT_TYPE.FIXED_AMOUNT) {
    totalDiscount = totalRaw - coupon.discountValue;
  } else {
    totalDiscount = totalRaw * (coupon.discountValue / 100);
  }
  if (totalDiscount > coupon.maxDiscountValue) totalDiscount = maxDiscountValue;
  return totalDiscount;
}

function getDiscountByCouponCode(couponCode) {
  const couponCode = dbContext.discounts.find(
    (discount) => discount.couponCode === couponCode
  );
  return couponCode;
}
function getDiscountById(id) {
  const couponCode = dbContext.discounts.find((discount) => discount.id === id);
  return couponCode;
}
function getAllAvailableDiscounts() {
  const now = new Date();
  return dbContext.discounts.filter(
    (discount) => discount.startDate > now && discount.endDate < now
  );
}

export {
  applyCoupon,
  checkValidCoupon,
  getAllAvailableDiscounts,
  getDiscountById,
  getDiscountByCouponCode,
};
