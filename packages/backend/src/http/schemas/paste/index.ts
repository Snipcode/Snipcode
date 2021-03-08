const byId = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
}

interface ById {
  Params: {
    id: string
  }
}

const create = {
  body: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
          },
          public: {
            type: 'boolean',
            default: false,
          },
        },
      },
    },
  },
}

interface Create {
  Body: {
    data: {
      content: string
      public: boolean
    }
  }
}

export { byId, ById, create, Create }
