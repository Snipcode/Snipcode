interface Invite {
  Body: {
    data: {
      code: string
    }
  }
}

const invite = {
  body: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
}

export { Invite, invite }
