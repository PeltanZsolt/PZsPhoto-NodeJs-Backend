function passwordValidator(password) {
   let strength = 0;
   if (password.match(/[a-z]+/)) {
      strength += 1;
    }
    if (password.match(/[A-Z]+/)) {
        strength += 1;
    }
    if (password.match(/[0-9]+/)) {
        strength += 1;
    }
    if (password.length < 3) {
        strength = 0;
   }
   if (strength >= 3) {
      return true;
   }
   return false;
}

module.exports = passwordValidator;
