import vine from '@vinejs/vine'


// Two shared validation rules: password and email

export const passwordValidationRule = {
  password: vine.string().minLength(8)
}

// login also uses this to determine whether the
// user is logging in with an email or a username
// Also see createIsEmailValidationSchema, below
export const isEmailValidationRule = {
  email: vine.string().email()
}

// Validation functions

export const createRegistrationValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule
      .email
      // we only check uniqueness on registration
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          // Neither of these had 'like' in the original
          // but the query fails with out them.
          // Regardless, they seem fraught, especially the whereNot
          .whereNot('id', 'like', field.meta.userId)
          .where('email', 'like', value)
          .first()
        return !user
      }),
    ...passwordValidationRule,
  })
)

export const createLoginValidationSchema = () => vine.compile(
  vine.object({
    email: vine.string(), // might be a username
    password: vine.string(), // don't reveal the minimum length here
  })
)

export const createNewPasswordValidationSchema = () => vine.compile(
  vine.object(passwordValidationRule)
)

export const createPasswordResetValidationSchema = () => vine.compile(
  vine.object(isEmailValidationRule) // we don't check for exists - no information to hackers
)

// login uses this to determine whether the
// user is logging in with an email or a username
export const createIsEmailValidationSchema = () => vine.compile(
  vine.object(isEmailValidationRule)
)


