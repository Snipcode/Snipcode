const authSchema = {
  body: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            minLength: 1,
          },
          password: {
            type: 'string',
            minLength: 1,
          },
          code: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
}

interface AuthSchema {
  Body: {
    data: {
      username: string
      password: string
      code?: string
    }
  }
}

export { authSchema, AuthSchema }
