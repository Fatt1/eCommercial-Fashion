import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = await getDbContextFromLocalStorage();
function getAllPaymentMethods() {
  return dbContext.paymentMethods;
}
export { getAllPaymentMethods };
