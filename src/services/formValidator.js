import { Validation } from "./validation.js";

export class FormValidator {
  constructor(config, formId) {
    this.config = config;
    this.form = document.getElementById(formId);
    this.errors = {};
  }
  validate() {
    this.errors = {}; // Xóa lỗi cũ trước khi kiểm tra lại
    let isValidForm = true;
    for (let fieldName in this.config) {
      let inputElem = this.form.querySelector(`input[name="${fieldName}"]`);
      if (!inputElem) continue; // Nếu không tìm thấy input, bỏ qua
      const value = inputElem.value;
      const fieldConfig = this.config[fieldName];
      const validator = new Validation(value);
      /*
      
      {
      email: {isRequire: "Email không đc bỏ trống", isEmail: "Ko khớp"}
      password: {isRequire: "Password ko đc bỏ trống"}
      }
      */
      if (fieldConfig.isRequired) {
        validator.isRequired(fieldConfig.isRequired);
      }
      if (fieldConfig.isEmail) {
        validator.isEmail(fieldConfig.isEmail);
      }
      if (fieldConfig.isNumber) {
        validator.isNumber(fieldConfig.isNumber);
      }
      if (fieldConfig.isMinLength) {
        validator.isMinLength(
          fieldConfig.isMinLength.value,
          fieldConfig.isMinLength.message
        );
      }
      if (fieldConfig.isMaxLength) {
        validator.isMaxLength(
          fieldConfig.isMaxLength.value,
          fieldConfig.isMaxLength.message
        );
      }
      if (fieldConfig.isRange) {
        validator.isRange(
          fieldConfig.isRange.min,
          fieldConfig.isRange.max,
          fieldConfig.isRange.message
        );
      }
      if (fieldConfig.checkConfirmPassword) {
        validator.checkConfirmPassword(
          document.getElementById("password").value,
          fieldConfig.checkConfirmPassword.message
        );
      }
      if (validator.errors.length > 0) {
        isValidForm = false;
        this.errors[fieldName] = validator.errors;
      }
    }
    return isValidForm;
  }
  displayErrors() {
    this.form.querySelectorAll(".error-message").forEach((elem) => {
      for (let fieldName in this.errors) {
        if (elem.classList.contains(`error-${fieldName}`)) {
          elem.textContent = this.errors[fieldName][0]; // Hiển thị lỗi đầu tiên
        }
      }
    });
  }
}
