export default class Order {
  constructor(
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
    status
  ) {
    this.id = id;
    this.customerId = customerId;
    this.street = street;
    this.city = city;
    this.ward = ward;
    this.district = district;
    this.items = items;
    this.totalCheckout = totalCheckout;
    this.totalPrice = totalPrice;
    this.totalApplyDiscount = totalApplyDiscount;
    this.feeShipping = feeShipping;
    this.paymentMethodId = paymentMethodId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = status;
  }
}

/*
  {
    
  }
*/
