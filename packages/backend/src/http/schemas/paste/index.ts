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

const edit = {
  body: {
    ...create.body,
    properties: {
      data: {
        type: 'object',
        required: ['content', 'id'],
        properties: {
          ...create.body.properties.data.properties,
          id: {
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
      public: boolean
    }
  }
}

type Edit = Create & {
  Body: {
    data: {
      id: string
    }
  }
}

export { byId, ById, create, Create, edit, Edit }
