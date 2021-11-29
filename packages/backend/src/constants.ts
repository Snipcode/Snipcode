import path from "path"

// todo: better name for file

export const __root = path.join(__dirname, "..", "..")

export const __packages = path.join(__root, "packages")

export const __frontend = {
  root: path.join(__packages, "frontend"),
  dist: path.join(__packages, "frontend", "dist")
}
