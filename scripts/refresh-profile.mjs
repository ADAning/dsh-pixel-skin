/**
 * Refresh the local dsh web profile after a skin rebuild.
 *
 * pnpm installs `file:` dependencies as a copy under the profile's
 * node_modules, so rebuilding the project alone does not update a running
 * profile. This script rebuilds the skin, then reinstalls the profile's
 * dependency tree so the profile picks up the fresh lib/client.js.
 */
import { rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const profile = process.env.DSH_PROFILE ?? 'web'
const profileDir = join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'profiles', profile)

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.error !== undefined) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run(process.execPath, [join(root, 'scripts/build.mjs')], root)

const nodeModules = join(profileDir, 'node_modules')
const lockfile = join(profileDir, 'pnpm-lock.yaml')
rmSync(nodeModules, { recursive: true, force: true })
rmSync(lockfile, { force: true })

run('pnpm', ['install', '--loglevel=error'], profileDir)
console.log(`dsh-pixel-skin: refreshed ${profileDir}`)
