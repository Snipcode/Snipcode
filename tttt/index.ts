import fs from 'fs'
import { convertTheme } from 'monaco-vscode-textmate-theme-converter'
import fetch from 'node-fetch'

const ccc = async () => {
  const theme = convertTheme(
    await (
      await fetch(
        'https://raw.githubusercontent.com/akamud/vscode-theme-onedark/master/themes/OneDark.json'
      )
    ).json()
  )

  fs.writeFileSync('oneDark.json', JSON.stringify(theme, null, 2))
}

ccc()
