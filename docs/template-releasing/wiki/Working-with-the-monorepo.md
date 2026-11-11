Originally, the Flourish template codebase was spread across many repos: each template, module and tool had its own repository in the `kiln` organisation. This gave each project author a lot of autonomy, but meant that maintenance because increasingly difficult to coordinate as the number of projects expanded.

So, we decided to merge all of our projects into a single repository. Each project still has its own package.json file with its own independent set of dependencies, with everything being managed as a [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaceshttps://docs.npmjs.com/cli/v7/using-npm/workspaces).

We also use [pnpm](https://pnpm.io) instead of npm to make working with the monorepo easier: at the time of writing it is faster, less prone to bugs, and has a better feature set for managing large workspaces than npm does. It supports the core commands that npm uses for dependency management — install, remove, upgrade, ls, etc. — though there are occasional differences between the two tools that may take some time to adjust to if you're not familiar with pnpm. The same can be said if you haven't worked with a project that uses workspaces and are used to projects having a single `package.json` file.

## Monorepo structure

There are three types of projects:

- `./templates` are our visualisations. Each of these is effectively their own smaller-scale single-page application.
- `./modules` are dependencies that other projects rely on. They are independently versioned, meaning that when you make a change to a module you should update its package.json version at the same time. Updating a module also requires updating all of its dependent templates. Not all modules will be publicly accessible on npm, but many are.
- `./tools` are projects that are used for development within the monorepo. It's not expected that you update their version when they change, and they're never published to the npm registry. Changing a tool should _not_ result in any change to a template.

## Installing the monorepo
You will need to clone the monorepo using SSH. If you do not have SSH keys set up, [follow the instructions here](https://docs.canva.tech/infrastructure/code-and-build/github/authentication/create-and-store-ssh-keys/).

Once you have cloned the repo, run `pnpm i` to get started

## Project scripts

There are a few `package.json` scripts which are recommended for every template. They might vary slightly in their approach, but the action they perform should be consistent.

``` json
{
    "scripts": {
        "start": "flourish run",
        "build": "rollup -c",
        "watch": "rollup -c --watch",
        "lint": "eslint src",
        "test": "flcypress run",
        "cypress": "flcypress open",
        "scheduled": "IS_SCHEDULED_TEST=1 pnpm t"
    }
}
```

To run any of these scripts for a project, you can either run `pnpm run [script-name]` from the project's directory, or use filters to run the same script from anywhere in the monorepo. The following two examples are equivalent:

``` bash
cd templates/template-globe && pnpm run cypress
```

``` bash
pnpm -F template-globe run cypress
```

### `start`

This should start the project in the Flourish SDK for local development. Normally this would be:

``` bash
flourish run
```

### `build`

This should perform a production build using the template's build tool. Normally this would be:

``` bash
rollup -c
```

### `watch`

This should start a development build of the template which updates whenever a file has changed. For the best results with rollup, you can use the following:

``` bash
rollup -cw --no-treeshake --no-indent --no-watch.clearScreen
```

The additional commandline flags are included to speed up the build by reducing the work rollup has to do, and to disable the default behaviour of rollup clearing the screen whenever the output file is rebuild.

### `cypress`

This should start an interactive session of Cypress for local development. The simplest way to approach this would be running it directly:

``` bash
flcypress open
```

If you have a `watch` script set up in your `package.json` file, that will be automatically run while running `flcypress`.

### `mocha`

This should run only the `mocha` tests for the project, for example:

``` bash
mocha
```

### `lint`

Should lint the project using `eslint`, e.g.:

``` bash
eslint src
```

### `test`

This should run your tests headlessly, as if they were being executed on a CI server. In most templates we solely use Cypress for testing, so it would look like so:

``` bash
flcypress run
```

If you have a `build` script set up in your `package.json` file, that will be automatically run before running `flcypress`.

### `scheduled`

We also have a scheduled test run that occurs daily, Monday to Thursday at 9am UTC ([more info here](https://canvadev.atlassian.net/wiki/spaces/DV/pages/3746465683/Daily+scheduled+tests)). This is generally used to run the template fuzzer, but may also be used for other types of testing in the future. `@flourish/cypress` will automatically switch its test directory from `cypress/e2e` to `cypress/e2e/scheduled` if you pass `IS_SCHEDULED_TEST=1` as an environment variable, so your scheduled test script should generally look like on of the two following commands:

``` bash
IS_SCHEDULED_TEST=1 flcypress run # Runs only Cypress
IS_SCHEDULED_TEST=1 pnpm t        # Runs all tests
```

Make sure to add a valid test to `cypress/e2e/scheduled` if you do this, as Cypress will fail if it can't detect any valid test files when it runs. Not every project will have a scheduled test to run — projects without this script will not run scheduled tests.

## Running scripts across multiple projects

pnpm's command-line interface includes some helpful features (such as [filtering](https://pnpm.io/filtering)) for running scripts and commands across multiple projects in bulk. This can be helpful for refactoring, or when work for a task spans across multiple projects. Combined with tools such as [jq](https://jqlang.github.io/jq/) or [@flourish/publisher](https://github.com/kiln/flourish-templates/tree/main/tools/flourish-publisher), there's a lot that you can do to perform bulk operations or analysis on projects.

You can run scripts for all projects using the `-r` flag:

``` bash
pnpm -r run test
```

You can run scripts for all changed projects by using `-F ...'[origin/main]'`:

``` bash
pnpm -F '...[origin/main]' run test
```

See the [one-liners with pnpm](#One-liners%20with%20pnpm) section for some more practical examples of this in action.

## Dependency management

### `workspace:^` and local dependencies

One of the nice things about moving to a workspace managed by pnpm is that local dependencies are automatically symlinked. This is something that normally has to be managed manually using `npm link`, which can be confusing and can easily revert itself. Dependencies are linked if:

* That dependency is also present in the monorepo
* The dependency version specifier (e.g. `^8.3.2`) matches the version listed in the dependency's `package.json` file.

So, if you have a project that is on version `8.3.2`, here's what you would expect with different versions listed in the `package.json` file:

Version Specifier|Outcome
-|-
8.3.2|Symlinked
^8.3.0|Symlinked
^8.1.0|Symlinked
^7.3.2|Installed from npm
8.3.0|Installed from npm
7.3.2|Installed from npm

This is already a big improvement, but does mean that if you choose to upgrade a local dependency you sometimes also need to manually update the `package.json` of every project that depends on it to ensure that it continues to match.

pnpm addresses this by adding the `workspace:^` specifier. This will:

* Always link the project when developing locally.
* When publishing, the version is converted into the current version of the dependency and add the caret (`^`) operator in front. This means that the published project will continue to use the latest available version until there is a breaking change.

**When referring to local dependencies, we should aim to use `workspace:^` instead of explicit version ranges as often as possible.** This will keep projects correctly versioned after they are published to npm, ensure that we're always working with the same module version across all of our projects, and mean that we don't need to manually update version ranges when updating a project.

The pnpm documentation has more information on how the `workspace:` protocol works in [its documentation on workspaces](https://pnpm.io/workspaces#workspace-protocol-workspace).

### `overrides` in the workspace `package.json` file

`pnpm` allows us to override the version used for specific dependencies across the monorepo, ensuring that the same version is used everywhere regardless of what a project has listed in its own `package.json` file. This is really useful for some of our bigger development dependencies, such as Cypress, eslint and babel, which will either break down or use a large amount of extra disk space when there are multiple versions present.

These overrides are specified in the `pnpm.overrides` field in the monorepo's root `package.json` file, and are listed in the same format as `dependencies` or `devDependencies`. For example:

``` json
{
  "pnpm": {
    "overrides": {
      "@babel/core": "^7.23.6",
      "@babel/preset-env": "^7.23.6",
      "cypress": "13.4.0",
      "eslint": "^8.47.0"
    }
  }
}
```

It's recommended that when using this feature, the versions listed in projects' package.json files continue to match the version specified in the overrides. This ensures that projects will continue to install consistently if they're installed outside of the monorepo, for example when installing a module through `npm` for an external project. The overrides are listed here to keep the monorepo from completely breaking if a project goes out of sync, but we should still aim to actively keep these dependencies up to date and consistent across projects.

## One-liners with pnpm

Run tests for all the projects that have been modified on your branch:

``` bash
pnpm -F '...[origin/main]' test
```

Install a devDependency in all templates in the monorepo:

``` bash
pnpm i -F './templates/*' -D rollup-plugin-visualizer
```

Validate the state of all projects in the monorepo:

``` bash
pnpm publisher validate -- $(pnpm ls -r -j | jq -r '.[].name')
```

Run a command on each project. You can replace “pwd” with any command to run it in each project’s directory. You can also replace `-r` with `-F …` to use a filter on a more narrow selection of projects:

``` bash
pnpm -r exec "pwd"
```

List all of the templates that don't yet depend on a module, e.g. with '@flourish/cypress':

``` bash
pnpm ls --json -F './templates/*' -F '!...@flourish/cypress' | jq -r '.[].name'
```

Generate a CSV containing every past template release:

``` bash
pnpm publisher versions -j | pnpm --package=d3-dsv dlx json2csv > template-releases.csv
```

List all of the versions currently in use for a module:

``` bash
pnpm -r ls @flourish/formatters
```

Upgrade all versions of a module to the latest version, in this case `@flourish/annotations`. If it's a project in the monorepo, this will upgrade them all to use `workspace:^`:

``` bash
pnpm i -F ...@flourish/annotations @flourish/annotations@latest
```

## Further reading

* [jq](https://jqlang.github.io/jq/)
* [pnpm docs: filtering](https://pnpm.io/filtering)
* [pnpm docs: pnpm.overrides](https://pnpm.io/package_json#pnpmoverrides)
* [pnpm docs: workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
* [npm docs: semver ranges](https://docs.npmjs.com/cli/v6/using-npm/semver#caret-ranges-123-025-004)