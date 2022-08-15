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
    await addToPath(binaryenInstallDir, toolName, version);

    toolName = 'tinygo';
    version = core.getInput(`${toolName}-version`);
    core.info(`Setting up ${toolName} version ${version}`);
    const tinyGoInstallDir = await installTinyGo(version);
    await addToPath(tinyGoInstallDir, toolName, version);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

// TODO: Redesign the code as having this function for both tinygo and binaryen is fugly.
async function addToPath(installDir: string, toolName: string, version: string) {
  let executable = toolName

  if (toolName == 'binaryen') {
    toolName = `${toolName}-version_${version}`
    executable = 'wasm-opt'
  }

  core.info(`Adding ${installDir}/${toolName}/bin to PATH`);
  core.addPath(path.join(installDir, toolName, 'bin'));
  const found = await io.findInPath(executable);
  core.info(`Found in path: ${found}`);
  const bin = await io.which(executable);
  if (executable == "tinygo") {
    printCommand(`${bin} version`);
    printCommand(`${bin} env`)
  }
  if (executable == "wasm-opt") {
    printCommand(`${bin} --version`);
  }
}

function printCommand(command: string) {
  core.info(`command to execute: ${command}`);
  const output = cp.execSync(command).toString();
  core.info(output);
}
