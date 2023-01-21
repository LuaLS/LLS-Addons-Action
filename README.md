# LLS-Addons-Action
A custom GitHub action that is used by [LLS-Addons](https://github.com/carsakiller/LLS-Addons) to get some metadata on addons such as their size and if they contain a plugin.

This is ***very*** niche so there is probably no other use case than when being used by [LLS-Addons](https://github.com/carsakiller/LLS-Addons).

## How it works
It expects that the repo has been [checked out](https://github.com/actions/checkout), **including its submodules**. It will then get a list of all submodules, get their metadata, and then write it to their `info.json` file. This allows the addon manager of [vscode-lua](https://github.com/sumneko/vscode-lua) to have metadata on the addon without pulling the whole submodule first.
