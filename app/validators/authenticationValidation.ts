import vine from '@vinejs/vine'
import {Database} from '@adonisjs/lucid/database'
import {FieldContext} from '@vinejs/vine/types'

// console.log('authenticationValidation',{vine})

// Shared uniqueness check
const isUnique = async (
  db: Database,
  value: string,
  field: FieldContext,
) => {
  // Neither whereNot nor where clauses had 'like' in the
  // Adocast example, but the query fails without 'like'.
  // The 'like' seems fraught, especially the whereNot

  // console.log ({field})
  const user = await db
    .from('users')
    .whereNot('id', field.meta.userId || 0) // we assume no id of '0'

    // if email never confirmed we let them claim it subject
    // to being able to get an email at that address.
    .where('is_email_confirmed', true)

    // field.name gives a type error, but field.wildCardPath
    // seems odd and maybe fragile.  What is it?
    .where(field.wildCardPath, value)
    .first()
  return !user
}

// Two shared validation rules: password and email

export const passwordValidationRule = (isOptional = false) => {
  // the gratuious lines of code below appease TypeScript
  // which doesn't like the type of the rule to change

  let passwordBaseRule = vine
    .string()
    .minLength(8)
    .maxLength(255)

  let result

  if (isOptional) {
    const optionalRule= passwordBaseRule.optional()
    result = {password: optionalRule}
  }
  else {
    result = {password : passwordBaseRule}
  }

  return result;
}

const usernameValidationRule = vine
    .string()
    .unique(isUnique)
    .maxLength(64)
    .optional()

// login also uses this to determine whether the
// user is logging in with an email or a username
// Also see createIsEmailValidationSchema, below
export const isEmailValidationRule = vine
  .string()
  .email()
  .maxLength(254)

// Validation functions

export const createRegistrationValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule.unique(isUnique),
    // email: vine.string().unique(isUnique).email().maxLength(254),
    ...passwordValidationRule(),
    username: usernameValidationRule,
    fullName: vine.string().maxLength(255).optional(),
    preferredName: vine.string().maxLength(64).optional(),
  })
)

export const createProfileValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule.unique(isUnique),
    ...passwordValidationRule(true),
    //// ...usernameValidationRule,
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
  vine.object(passwordValidationRule())
)

export const createPasswordResetValidationSchema = () => vine.compile(
// we don't check for exists - no information to hackers
  vine.object({email: isEmailValidationRule})
)

// login uses this to determine whether the
// user is logging in with an email or a username
export const createIsEmailValidationSchema = () => vine.compile(
  // this gives a validation system failure for some reason
  // vine.object(isEmailValidationRule)
  // but this works fine. The only difference is the maxLength
  // which works elsewhere.  Why?
  vine.object({email: vine.string().email()})
)


