// TODO: Refactor code so we don't have duplicate functions (considering 95% of the logic is the same).

import * as tool from '@actions/tool-cache';
import * as core from '@actions/core';
import { getArch, getPlatform } from './sys';

const arch = getArch();
const platform = getPlatform();

export async function installBinaryen(version: string): Promise<string> {
  const toolName = 'binaryen';
  core.debug(`Checking cache for ${toolName} v${version} ${arch}`);
  const cachedDirectory = tool.find(toolName, version, arch);
  if (cachedDirectory) {
    // tool version found in cache
    return cachedDirectory;
  }

  core.debug(`Downloading ${toolName} v${version} for ${platform} ${arch}`);
  try {
    const downloadPath = await downloadBinaryen(version);
    const extractedPath = await extractArchive(downloadPath);
    const cachedPath = await tool.cacheDir(
      extractedPath,
      toolName,
      version,
      arch,
    );

    return cachedPath;
  } catch (error: any) {
    throw new Error(`Failed to download version ${version}: ${error}`);
  }
}

async function downloadBinaryen(version: string): Promise<string> {
  const extension = platform === 'windows' ? 'zip' : 'tar.gz';
  let p = platform
  if (platform === 'darwin') {
    p = 'macos';
  }
  const downloadURL = `https://github.com/WebAssembly/binaryen/releases/download/version_${version}/binaryen-version_${version}-${arch}-${p}.${extension}`;
  core.debug(`Downloading from ${downloadURL}`);
  const downloadPath = await tool.downloadTool(downloadURL);
  core.debug(`Downloaded binaryen release to ${downloadPath}`);
  return downloadPath;
}

async function extractArchive(downloadPath: string): Promise<string> {
  let extractedPath = '';
  if (platform === 'windows') {
    extractedPath = await tool.extractZip(downloadPath);
  } else {
    extractedPath = await tool.extractTar(downloadPath);
  }

  return extractedPath;
}

export async function installTinyGo(version: string): Promise<string> {
  const toolName = 'tinygo';
  core.debug(`Checking cache for ${toolName} v${version} ${arch}`);
  const cachedDirectory = tool.find(toolName, version, arch);
  if (cachedDirectory) {
    // tool version found in cache
    return cachedDirectory;
  }

  core.debug(`Downloading ${toolName} v${version} for ${platform} ${arch}`);
  try {
    const downloadPath = await downloadTinyGo(version);
    const extractedPath = await extractArchive(downloadPath);
    const cachedPath = await tool.cacheDir(
      extractedPath,
      toolName,
      version,
      arch,
    );

    return cachedPath;
  } catch (error: any) {
    throw new Error(`Failed to download version ${version}: ${error}`);
  }
}

async function downloadTinyGo(version: string): Promise<string> {
  const extension = platform === 'windows' ? 'zip' : 'tar.gz';
  const downloadURL = `https://github.com/tinygo-org/tinygo/releases/download/v${version}/tinygo${version}.${platform}-${arch}.${extension}`;
  core.debug(`Downloading from ${downloadURL}`);
  const downloadPath = await tool.downloadTool(downloadURL);
  core.debug(`Downloaded tinygo release to ${downloadPath}`);
  return downloadPath;
}
