/** Find an actual Node binary without executing anything or assuming Electron is Node. */
import { statSync } from 'node:fs'
import { posix, win32 } from 'node:path'

export function automationNode(options: { execPath: string; electron?: string; path: string; platform: NodeJS.Platform }, isFile: (file: string) => boolean = (file) => { try { return statSync(file).isFile() } catch { return false } }): string {
  const paths = options.platform === 'win32' ? win32 : posix
  if (!options.electron && /^node(?:\.exe)?$/i.test(paths.basename(options.execPath)) && paths.isAbsolute(options.execPath) && isFile(options.execPath)) return options.execPath
  const name = options.platform === 'win32' ? 'node.exe' : 'node'
  for (const entry of options.path.split(options.platform === 'win32' ? ';' : ':')) {
    const dir = entry.trim().replace(/^"(.*)"$/, '$1')
    if (!paths.isAbsolute(dir)) continue
    const candidate = paths.join(dir, name)
    if (isFile(candidate)) return candidate
  }
  throw new Error('Node is unavailable. Install Node or create a task with an explicit Node executable.')
}
