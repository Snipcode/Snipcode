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
          },
          password: {
            type: 'string',
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
