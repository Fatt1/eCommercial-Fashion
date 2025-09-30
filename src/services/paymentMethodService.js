import { getDbContextFromLocalStorage } from "../helper/initialData.js";

await getDbContextFromLocalStorage();
function getAllPaymentMethods() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.paymentMethods;
}
function getPaymentMethodById(id) {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.paymentMethods.find((p) => p.id === id);
}
export { getAllPaymentMethods, getPaymentMethodById };
