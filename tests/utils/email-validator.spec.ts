import { isValidEmail } from '@/utils/email-validator'

describe('isValidEmail test case', () => {
  it('returns true for a valid email', () => {
    const validEmails = [
      'test@example.com',
      'john.doe@example.co',
      'user123@example.co.uk'
    ]

    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true)
    })
  })

  it('returns false for an empty email', () => {
    const emptyEmail = ''

    expect(isValidEmail(emptyEmail)).toBe(false)
  })

  it('returns false for an email with an invalid format', () => {
    const invalidEmails = [
      'test@example',
      'test.example.com',
      'john.doe@',
      'user123@.co'
    ]

    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false)
    })
  })
})
