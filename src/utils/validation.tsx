export function validateEmail(value: string) {
  let error;

  if (!value) {
    error = 'Please enter your details';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
}

export function validatePassword(value: string) {
  let error;

  if (!value) {
    error = 'Please enter your details';
  } else if (value.length < 8) {
    error = 'Password should contain atleast 8 characters';
  } else if (!value.match(/[A-Z]/)) {
    error = 'Contains atleast one uppercase';
  } else if (!value.match(/[a-z]/)) {
    error = 'Contains atleast one lowercase';
  } else if (!value.match(/[0-9]/)) {
    error = 'Contains atleast one number';
  } else if (!value.match(/^(?=.*[@#$%^&+=?:*%\-\)\(!)]).*$/)) {
    error = 'Contains atleast one special character';
  }
  return error;
}
