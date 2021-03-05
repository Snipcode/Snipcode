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
            transform: ['trim'],
            minLength: 1,
          },
          password: {
            type: 'string',
            transform: ['trim'],
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
    }
  }
}

export { authSchema, AuthSchema }
