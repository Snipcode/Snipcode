import store from '..'

const setTitle = (str?: string | null) => {
  store.title = str ? str : ''

  // TODO: Custom instance name
  document.title =
    store.title.trim().length === 0
      ? store.options.name
      : `${str} | ${store.options.name}`
}

export { setTitle }
export default setTitle
