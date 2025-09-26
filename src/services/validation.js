export class Validation {
  constructor(value) {
    this.value = value;
    this.errors = [];
  }
  isRequired(message) {
    if (
      this.value === null ||
      this.value === undefined ||
      this.value === "" ||
      this.value.length === 0
    ) {
      this.errors.push(message);
    }
    return this;
  }
  isNumber(message) {
    if (isNaN(this.value)) {
      this.errors.push(message);
    }
    return this;
  }
  isEmail(message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }
  isMaxLength(max, message) {
    if (this.value.length > max) {
      this.errors.push(message);
    }
    return this;
  }
  isRange(min, max, message) {
    if (this.value < min || this.value > max) {
      this.errors.push(message);
    }
    return this;
  }
  isMinLength(min, message) {
    if (this.value.length < min) {
      this.errors.push(message);
    }
    return this;
  }
}
