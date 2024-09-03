import vine from '@vinejs/vine'

export const createContactFormValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    email: vine.string().email(),
    message: vine.string().trim().escape()
  })
)
