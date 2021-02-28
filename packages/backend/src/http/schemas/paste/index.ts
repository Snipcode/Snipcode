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
        },
      },
    },
  },
}

interface Create {
  Body: {
    data: {
      content: string
    }
  }
}

export { byId, ById, create, Create }
