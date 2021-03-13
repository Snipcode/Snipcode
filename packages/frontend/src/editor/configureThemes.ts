import * as monaco from 'monaco-editor'

const configureThemes = async ($m: typeof monaco) => {
  const theme = await (await fetch('/editor/themes/oceanicNext.json')).json()

  $m.editor.defineTheme('oceanicNext', theme)
}

export { configureThemes }
export default configureThemes
