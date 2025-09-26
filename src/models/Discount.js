export default class Discount {
  constructor(
    id,
    couponCode,
    name,
    discountValue,
    maxDiscountValue,
    minDiscountValue,
    startDate,
    endDate,
    type
  ) {
    this.id = id;
    this.couponCode = couponCode;
    this.name = name;
    this.discountValue = discountValue;
    this.startDate = startDate;
    this.endDate = endDate;
    this.type = type;
    (this.maxDiscountValue = maxDiscountValue),
      (this.minDiscountValue = minDiscountValue);
  }
}
