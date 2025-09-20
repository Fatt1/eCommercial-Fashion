export default class Sku {
  constructor(
    id,
    productId,
    stock,
    originalPrice,
    tierIndexes,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.productId = productId;
    this.stock = stock;
    this.originalPrice = originalPrice;
    this.tierIndexes = tierIndexes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
/*
{
  id: "123",
  productId: "213",
  stock: 5,
  originalPrice: 245.000,
  image: "abz.png",
  tierIndexes: [0, 1] (hoặc [2], [0, 2] ....)
  createAt: "20:20:12 12/12/2025",
  updateAt: "20:20:12 12/12/2025",
}
*/
