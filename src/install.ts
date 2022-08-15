// TODO: Refactor code so we don't have duplicate functions (considering 95% of the logic is the same).

import * as tool from '@actions/tool-cache';
import * as core from '@actions/core';
import { getArch, getPlatform } from './sys';

const arch = getArch();
const platform = getPlatform();

export async function installBinaryen(version: string): Promise<string> {
  const toolName = 'binaryen';

  let a = arch
  if (arch === 'amd64') {
    a = 'x86_64'; // Binaryen only offers arm64 and x86_64.
  }
  let p = platform
  if (platform === 'darwin') {
    p = 'macos'; // Binaryen names its Darwin files using commercial name.
  }

  core.info(`Checking cache for ${toolName} v${version} ${a}`);
  const cachedDirectory = tool.find(toolName, version, arch);
  if (cachedDirectory) {
    // tool version found in cache
    return cachedDirectory;
  }

  core.info(`Downloading ${toolName} v${version} for ${p} ${a}`);
  try {
    const downloadPath = await downloadBinaryen(version, a, p);
    const extractedPath = await extractArchive(downloadPath, toolName);
    core.info(`Extracted to: ${extractedPath}`);
    const cachedPath = await tool.cacheDir(
      extractedPath,
      toolName,
      version,
      a,
    );
    core.info(`Cached path: ${cachedPath}`);

    return cachedPath;
  } catch (error: any) {
    throw new Error(`Failed to download version ${version}: ${error}`);
  }
}

async function downloadBinaryen(version: string, a: string, p: string): Promise<string> {
  const extension = 'tar.gz';
  const downloadURL = `https://github.com/WebAssembly/binaryen/releases/download/version_${version}/binaryen-version_${version}-${a}-${p}.${extension}`;
  core.info(`Downloading from ${downloadURL}`);
  const downloadPath = await tool.downloadTool(downloadURL);
  core.info(`Downloaded binaryen release to ${downloadPath}`);
  return downloadPath;
}

export async function installTinyGo(version: string): Promise<string> {
  const toolName = 'tinygo';
  core.info(`Checking cache for ${toolName} v${version} ${arch}`);
  const cachedDirectory = tool.find(toolName, version, arch);
  if (cachedDirectory) {
    // tool version found in cache
    return cachedDirectory;
  }

  core.info(`Downloading ${toolName} v${version} for ${platform} ${arch}`);
  try {
    const downloadPath = await downloadTinyGo(version);
    const extractedPath = await extractArchive(downloadPath, toolName);
    core.info(`Extracted to: ${extractedPath}`);
    const cachedPath = await tool.cacheDir(
      extractedPath,
      toolName,
      version,
      arch,
    );
    core.info(`Cached path: ${cachedPath}`);

    return cachedPath;
  } catch (error: any) {
    throw new Error(`Failed to download version ${version}: ${error}`);
  }
}

async function downloadTinyGo(version: string): Promise<string> {
  const extension = platform === 'windows' ? 'zip' : 'tar.gz';
  const downloadURL = `https://github.com/tinygo-org/tinygo/releases/download/v${version}/tinygo${version}.${platform}-${arch}.${extension}`;
  core.info(`Downloading from ${downloadURL}`);
  const downloadPath = await tool.downloadTool(downloadURL);
  core.info(`Downloaded tinygo release to ${downloadPath}`);
  return downloadPath;
}

async function extractArchive(downloadPath: string, toolName: string): Promise<string> {
  let extractedPath = '';
  if (platform === 'windows' && toolName == "tinygo") {
    extractedPath = await tool.extractZip(downloadPath);
  } else {
    extractedPath = await tool.extractTar(downloadPath);
  }

  return extractedPath;
}
