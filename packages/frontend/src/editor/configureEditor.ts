import * as monaco from 'monaco-editor'
import { configureThemes } from './configureThemes'

const configureEditor = async ($monaco: typeof monaco) => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    allowJs: true,
  })

  await configureThemes($monaco)
}

export { configureEditor }
export default configureEditor
