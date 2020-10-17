export function validateEmail(value: string) {
  let error;

  if (!value) {
    error = "Please enter your details";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

export function validatePassword(value: string) {
  let error;

  if (!value) {
    error = "Please enter your details";
  } else if (value.length < 8) {
    error = "Password should contain at least 8 characters";
  } else if (!value.match(/[A-Z]/)) {
    error = "Password should contain at least one uppercase";
  } else if (!value.match(/[a-z]/)) {
    error = "Password should contain at least one lowercase";
  } else if (!value.match(/[0-9]/)) {
    error = "Password should contain at least one number";
  } else if (!value.match(/^(?=.*[@#$%^&+=?:*%\-\)\(!)]).*$/)) {
    error = "Password should contain at least one special character";
  }
  return error;
}

export function create_id() {
  let dt = new Date().getTime();
  let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return id;
}
