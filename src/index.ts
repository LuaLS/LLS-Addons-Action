import * as core from "@actions/core";
import simpleGit from "simple-git";
import path from "path";
import * as fs from "fs";

const submoduleRegex = /([A-z0-9]+) (.*\/.*) .*/g;

/** Calculate the size of a directory, recursively
 * @param directory The path to the directory
 * @return The size of the directory in bytes
 */
async function getDirectorySize(directory: string): Promise<number> {
  let totalSize = 0;

  const files = await fs.promises.readdir(directory);
  for (const file of files) {
    const filePath = `${directory}/${file}`;
    const fileStat = await fs.promises.stat(filePath);
    if (fileStat.isDirectory()) {
      totalSize += await getDirectorySize(filePath);
    } else {
      totalSize += fileStat.size;
    }
  }

  return totalSize;
}

async function run() {
  try {
    const git = simpleGit();

    const submoduleList = await git.subModule();

    for (const submoduleMatch of submoduleList.matchAll(submoduleRegex)) {
      const sha = submoduleMatch[1];
      const submodulePath = submoduleMatch[2];

      const infoFilePath = path.join(submodulePath, "..", "info.json");

      const rawInfo = await fs.promises.readFile(infoFilePath);
      const info = JSON.parse(rawInfo.toString());

      info.size = await getDirectorySize(submodulePath);
      info.hasPlugin = fs.existsSync(
        path.join(submodulePath, "plugin.lua")
      );

      console.log(
        `${submodulePath} | Size: ${info.size} | Plugin: ${info.hasPlugin}`
      );

      fs.promises.writeFile(
        infoFilePath,
        `${JSON.stringify(info, null, "  ")}\n`
      );
    }
  } catch (error) {
    if (error instanceof Error) return core.setFailed(error.message);
    return core.setFailed(error as string);
  }
}

run();
