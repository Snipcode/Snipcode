const { exec } = require('child_process')
const path = require('path')
const glob = require('glob').sync

const bumpDeps = async (depsList, dev = false, workspace) => {
  if (!depsList || typeof depsList !== "object") return;

  const depsString = Object.keys(depsList).join(" ")

  await new Promise((resolve, reject) => {
    const cmd = ["yarn", workspace ? `workspace ${workspace}` : "-W", "add", ...(dev ? ['-D'] : []), depsString].join(" ")
    console.log(`$$ ${cmd}`)

    const e = exec(cmd)
    if (!e.stdout) return reject(new Error("There's no stdout."))

    e.stdout.pipe(process.stdout)
    e.stdout.on('end', resolve)
  })
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
