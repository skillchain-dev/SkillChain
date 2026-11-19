export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Email is required';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address';
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return '';
}

export function validateName(value) {
  if (!value || !value.trim()) return 'Name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
}

export function validateRequired(value, label = 'This field') {
  if (value === undefined || value === null || String(value).trim() === '') return `${label} is required`;
  return '';
}

// Runs a { field: validator(value) } map and returns { field: message } for failures only.
export function runValidators(values, validators) {
  const errors = {};
  Object.entries(validators).forEach(([field, validator]) => {
    const message = validator(values[field]);
    if (message) errors[field] = message;
  });
  return errors;
}
