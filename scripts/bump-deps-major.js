const { exec } = require('child_process')
const path = require('path')
const glob = require('glob').sync

const bumpDeps = async (depsList, dev = false, workspace) => {
  for (const dependency in depsList) {
    await new Promise((resolve, reject) => {
      const _workspace = workspace ? `workspace ${workspace}` : '-W'
      const _devFlag = dev ? '-D ' : ''

      const cmd = `yarn ${_workspace} add ${_devFlag}${dependency}`
      console.log(`$$ ${cmd}`)

      const e = exec(cmd)
      if (!e.stdout) return reject(new Error("There's no stdout."))

      e.stdout.pipe(process.stdout)
      e.stdout.on('end', resolve)
    })
  }
}

;(async () => {
  const _root = require('../package.json')

  await bumpDeps(_root.dependencies, false)
  await bumpDeps(_root.devDependencies, true)

  if (_root.workspaces) {
    _root.workspaces.forEach(async (workspace) => {
      for (const str of glob(workspace)) {
        const _pkg = require(path.join(__dirname, "..", str, 'package.json'))

        await bumpDeps(_pkg.dependencies, false, _pkg.name)
        await bumpDeps(_pkg.devDependencies, true, _pkg.name)
      }
    })
  }
})()
