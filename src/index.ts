import * as core from "@actions/core";
import * as github from "@actions/github";
import simpleGit from "simple-git";

const submoduleRegex = /([A-z0-9]+) (.*\/.*) .*/g;
const submodules = [];

async function run() {
  try {
    const git = simpleGit();

    const submoduleChanges = await git.diff(["--name-only"]);

    console.log(submoduleChanges);

    const GitHubToken = core.getInput("GH_token");
    const GitLabToken = core.getInput("GL_token");

    if (!GitHubToken) throw new Error("GitHub token not specified");
    if (!GitLabToken) throw new Error("GitLab token not specified");

    // const octokit = github.getOctokit(GitHubToken);
  } catch (error) {
    if (error instanceof Error) return core.setFailed(error.message);
    return core.setFailed(error);
  }
}

run();
