import {
  PAY_BASE_URL,
  PAY_CLIENT_ID,
  PAY_SECRET,
} from "../constant/Constant.js";
import { convertVndToUsd } from "../helper/helper.js";
export async function generateAccessToken() {
  const credentials = `${PAY_CLIENT_ID}:${PAY_SECRET}`;
  const encodedCredentials = btoa(credentials); // mã hóa chuỗi sang base64
  const bodyParams = new URLSearchParams();
  bodyParams.append("grant_type", "client_credentials");
  try {
    const response = await fetch(PAY_BASE_URL + "/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        // Content-Type cho body là x-www-form-urlencoded
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });
    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
  } catch (err) {
    console.log(err);
  }
}
export async function payWithPayPal(checkoutOrder) {
  const accessToken = await generateAccessToken();
  try {
    const itemTotal = convertVndToUsd(checkoutOrder.totalPrice);
    const shipping = convertVndToUsd(checkoutOrder.feeShipping);
    const discount = convertVndToUsd(checkoutOrder.totalDiscount);

    const totalCheckout = (itemTotal + shipping - discount).toFixed(2);
    const items = checkoutOrder.itemsCheckout.map((checkout) => {
      return {
        name: checkout.item.productName,
        quantity: checkout.quantity,
        unit_amount: {
          currency_code: "USD",
          value: convertVndToUsd(checkout.item.currentlyPrice),
        },
      };
    });
    const response = await fetch(PAY_BASE_URL + "/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              landing_page: "LOGIN",

              user_action: "PAY_NOW",
              return_url:
                "http://127.0.0.1:5500/src/public/payment-successful.html",
              cancel_url:
                "http://127.0.0.1:5500/src/public/cancel-payment.html",
            },
          },
        },

        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalCheckout,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: itemTotal,
                },
                shipping: {
                  currency_code: "USD",
                  value: shipping, // <-- PHÍ VẬN CHUYỂN BẠN MUỐN THÊM
                },
                discount: {
                  // <-- KHOẢN GIẢM TRỪ
                  currency_code: "USD",
                  value: discount, // <-- Số tiền chiết khấu (2.00 USD)
                },
              },
            },
            items: items,
          },
        ],
      }),
    });
    const dataResponse = await response.json();
    console.log(dataResponse);
    if (response.ok) {
      return dataResponse.links.find((link) => link.rel === "payer-action")
        .href;
    }
  } catch (err) {
    console.log(err);
  }
}
