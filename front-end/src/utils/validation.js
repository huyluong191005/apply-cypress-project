// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone validation (basic US format)
export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// CVV validation
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

// Expiration date validation (MM/YY format)
export const validateExpirationDate = (expDate) => {
  const match = expDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1]);
  const year = parseInt('20' + match[2]);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiry = new Date(year, month - 1);

  return expiry > now;
};

// ZIP code validation
export const validateZipCode = (zip) => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

// Required field validation
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Form validation
export const validateShippingForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (!validateRequired(formData.address)) {
    errors.address = 'Address is required';
  }

  if (!validateRequired(formData.city)) {
    errors.city = 'City is required';
  }

  if (!validateRequired(formData.state)) {
    errors.state = 'State is required';
  }

  if (!validateRequired(formData.zipCode)) {
    errors.zipCode = 'ZIP code is required';
  } else if (!validateZipCode(formData.zipCode)) {
    errors.zipCode = 'Invalid ZIP code';
  }

  if (!validateRequired(formData.country)) {
    errors.country = 'Country is required';
  }

  return errors;
};

export const validatePaymentForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.cardNumber)) {
    errors.cardNumber = 'Card number is required';
  } else if (!validateCreditCard(formData.cardNumber)) {
    errors.cardNumber = 'Invalid card number';
  }

  if (!validateRequired(formData.cardholderName)) {
    errors.cardholderName = 'Cardholder name is required';
  }

  if (!validateRequired(formData.expirationDate)) {
    errors.expirationDate = 'Expiration date is required';
  } else if (!validateExpirationDate(formData.expirationDate)) {
    errors.expirationDate = 'Invalid or expired date';
  }

  if (!validateRequired(formData.cvv)) {
    errors.cvv = 'CVV is required';
  } else if (!validateCVV(formData.cvv)) {
    errors.cvv = 'Invalid CVV';
  }

  return errors;
};
