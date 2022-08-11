import * as io from '@actions/io';
import cp from 'child_process';
import * as core from '@actions/core';
import path from 'path';
import { installBinaryen, installTinyGo } from './install';

setup();

// NOTE: We only allow configuration for TinyGo version.
// The Binaryen version is controlled by this GitHub Action.
//
// TODO: Allow Binaryen version to be configurable.
async function setup() {
  try {
    let toolName = 'binaryen'
    let version = '109';
    core.info(`Setting up ${toolName} version ${version}`);
    const binaryenInstallDir = await installBinaryen(version); // current latest (June 2022)
    await addToPath(binaryenInstallDir, toolName);

    toolName = 'tinygo';
    version = core.getInput('${toolName}-version');
    core.info(`Setting up ${toolName} version ${version}`);
    const tinyGoInstallDir = await installTinyGo(version);
    await addToPath(tinyGoInstallDir, toolName);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

async function addToPath(installDir: string, toolName: string) {
  core.info(`Adding ${installDir}/${toolName}/bin to PATH`);
  core.addPath(path.join(installDir, toolName, 'bin'));
  const found = await io.findInPath(toolName);
  core.debug(`Found in path: ${found}`);
  const tool = await io.which(toolName);
  printCommand(`${tool} version`);
  printCommand(`${tool} env`);
}

function printCommand(command: string) {
  const output = cp.execSync(command).toString();
  core.info(output);
}
