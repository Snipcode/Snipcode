import * as monaco from 'monaco-editor'

export const configureEditor = async ($monaco: typeof monaco) => {
  $monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })

  $monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    allowJs: true,
  })

  const theme = await (await fetch('/editor/themes/snipcode-default.json')).json()

  $monaco.editor.defineTheme(editorThemeName, theme)
}

export const editorThemeName = 'snipcode'
