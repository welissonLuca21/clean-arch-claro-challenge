export const EMAIL_REGEX =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export const isValidEmail = (email: string): boolean => {
  const emailIsEmpty = !email
  if (emailIsEmpty) {
    return false
  }

  const numberOfParts = email.split('@').length
  const isValidNumberOfParts = numberOfParts === 2
  if (!isValidNumberOfParts) {
    return false
  }

  const isValidEmail = EMAIL_REGEX.test(email)
  return isValidEmail
}
