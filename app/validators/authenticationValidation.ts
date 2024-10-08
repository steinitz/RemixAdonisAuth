import { Database } from '@adonisjs/lucid/database'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

// Two shared validation rules: password and email

export const passwordValidationRule = {
  password: vine.string().minLength(8).maxLength(255)
}

// login also uses this to determine whether the
// user is logging in with an email or a username
// Also see createIsEmailValidationSchema, below
export const isEmailValidationRule = {
  email: vine.string().email().maxLength(254)
}

// Unique test, shared by username and email. Kinda cool
const isUnique = async (
  db: Database,
  value: string,
  field: FieldContext,
) => {
  // Neither whereNot nor where clauses had 'like' in the
  // Adocast example, but the query fails without 'like'.
  // The 'like' seems fraught, especially the whereNot

  const user = await db
    .from('users')
    .whereNot('id', 'like', field.meta.userId)

    // field.name gives a type error, but field.wildCardPath
    // seems odd and maybe fragile.  What is it?
    .where(field.wildCardPath, 'like', value)
    .first()
  return !user
}

// Validation functions

export const createRegistrationValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule
      .email
      .unique(isUnique),
    ...passwordValidationRule,
    username: vine.string().unique(isUnique).maxLength(64).optional(),
    fullName: vine.string().maxLength(255).optional(),
    preferredName: vine.string().maxLength(64).optional(),
  })
)

export const createProfileValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule
      .email
      .unique(isUnique),
    ...passwordValidationRule,
    username: vine.string().unique(isUnique).maxLength(64).optional(),
    fullName: vine.string().maxLength(255).optional(),
    preferredName: vine.string().maxLength(64).optional(),
  })
)

export const createLoginValidationSchema = () => vine.compile(
  vine.object({
    email: vine.string(), // 1.might be a username, 2.no need to check uniqueness
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


