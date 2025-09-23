import { getSkusByProductId } from "../services/productService.js";

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

function isEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

export function getSkuByProductId(productId, tierIndexes) {
  const skus = getSkusByProductId(productId);

  for (let element of skus) {
    if (isEqualArray(element.tierIndexes, tierIndexes)) {
      return element;
    }
  }

  return null;
}

// export function getSkuByProductId(productId, tierIndexes) {
//   getSkusByProductId(productId).forEach((element) => {
//     if (element.tierIndexes === tierIndexes) return element;
//     console.log(element);
//   });
//   // console.log(getSkusByProductId(productId));
// }

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
