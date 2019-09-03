const path = require('path')
// return correct path in different environment
// extraResources need be set package.json
// relativePath: relate to project root in development mode
export function extraResourcePath(relativePath) {
  if (process.env.NODE_ENV === 'production') {
    return path.join(process.resourcesPath, relativePath)
  } else {
    const projectDir = path.resolve(__filename, '../../../../')
    return path.join(projectDir, relativePath)
  }
}
