import vine from '@vinejs/vine'

export const passwordValidationRule = {password: vine.string().minLength(8)}


export const createRegistrationValidationSchema = () => vine.compile(
 vine.object({
    email: vine
      .string()
      .email()
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
    email: vine
      .string()
      .email(),
    ...passwordValidationRule,
  })
)


export const createNewPasswordValidationSchema = () => vine.compile(
 vine.object({
     ...passwordValidationRule,
  })
)
