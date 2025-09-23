export class PaymentMethod {
  constructor(id, name, createdAt, updatedAt) {
    this.id = id;
    this.name = name; // e.g., 'credit_card', 'paypal', etc.
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
