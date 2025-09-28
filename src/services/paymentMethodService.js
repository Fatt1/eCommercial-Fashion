import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = await getDbContextFromLocalStorage();
function getAllPaymentMethods() {
  return dbContext.paymentMethods;
}
function getPaymentMethodById(id) {
  return dbContext.paymentMethods.find((p) => p.id === id);
}
export { getAllPaymentMethods, getPaymentMethodById };
