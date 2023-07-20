export default function isPasswordValid(input: string): boolean {
    const upperCaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[^A-Za-z0-9]/;
  
    const hasUpperCase = upperCaseRegex.test(input);
    const hasNumber = numberRegex.test(input);
    const hasSpecialChar = specialCharRegex.test(input);
  
    return hasUpperCase && hasNumber && hasSpecialChar;
  }