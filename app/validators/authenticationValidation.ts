import vine, {VineString} from '@vinejs/vine'
import {OptionalModifier} from '@vinejs/vine/schema/base/literal'
import {Database} from '@adonisjs/lucid/database'
import {FieldContext} from '@vinejs/vine/types'

// Shared uniqueness check, Used by Vine's (actually Lucid's) unique macro
const isUnique = async (
  db: Database,
  value: string,
  field: FieldContext,
) => {
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

//
// Shared validation rules
//

export const passwordValidationRule = (isOptional = false): VineString | OptionalModifier<VineString>  => {
  let passwordBaseRule = vine
    .string()
    .minLength(8)
    .maxLength(255)

  // let result: VineString | OptionalModifier<VineString> = passwordBaseRule
  let result: VineString | OptionalModifier<VineString>  = passwordBaseRule
  if (isOptional) {
    result = passwordBaseRule.optional()
  }

  return result;
}

const usernameValidationRule = vine
    .string()
    .maxLength(64)
    .unique(isUnique)
    .optional()

// Login also uses this, indirectly, to determine whether
// the user is logging in with an email or a username.
// See createIsEmailValidationSchema, below.
export const isEmailValidationRule = vine
  .string()
  .email()
  .maxLength(254)

export const fullNameValidationRule = vine
  .string()
  .maxLength(255)
  .optional()

export const preferredNameValidationRule = vine
  .string()
  .maxLength(64)
  .optional()

//
// Validation functions
//

export const createRegistrationValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule,
    password: passwordValidationRule(),
    username: usernameValidationRule,
    fullName: fullNameValidationRule,
    preferredName: preferredNameValidationRule,
  })
)

export const createProfileValidationSchema = () => vine.compile(
  vine.object({
    email: isEmailValidationRule.unique(isUnique),
    password: passwordValidationRule(true),
    username: usernameValidationRule,
    fullName: fullNameValidationRule,
    preferredName: preferredNameValidationRule,
  })
)

export const createLoginValidationSchema = () => vine.compile(
  vine.object({
    email: vine.string(), // 1.might be a username, 2.no need to check uniqueness
    password: vine.string(), // don't reveal the minimum length here
  })
)

export const createNewPasswordValidationSchema = () => vine.compile(
  vine.object({password: passwordValidationRule()})
)

export const createPasswordResetValidationSchema = () => vine.compile(
  // we don't check for exists - no information to hackers
  vine.object({email: isEmailValidationRule})
)

// login uses this to determine whether the
// user is logging in with an email or a username
export const createIsEmailValidationSchema = () => vine.compile(
  vine.object({email: isEmailValidationRule})
)


