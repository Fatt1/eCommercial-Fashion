export default class Order{
  constructor(id, customerId, items, total, status, createdAt, updatedAt) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.total = total;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}