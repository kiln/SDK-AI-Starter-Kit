Semantic Versioning (SemVer) is a [specification describing version numbers](https://semver.org/) that correspond to the type of change being made. By establishing this convention it makes it easier for project authors to indicate the significance of a new release, and for consumers to opt-in to upgrades of varying degrees depending on their preferences. If you haven't [read the specification](https://semver.org/) before, it is not long and definitely worth taking a look.

SemVer is how packages published to npm are versioned, and it is what Flourish uses to version its templates. These two use cases have slightly different needs, but roughly the same approach is used when choosing a new version for both.

## Template release management with SemVer

Sometimes it can be a little unclear whether a change is breaking or not. When developing libraries on npm, it's often safer to lean towards a major bump when uncertain as they are fairly cheap: it's not the end of the day to require a manual upgrade when it's not needed. However there's extra work involved in releasing a new major version for a template, and extra work for visualisation authors to do a major version upgrade too. So in the interest of making things easier it's helpful to have confidence in which increment to use for a given release.

> [!NOTE]
> This tension around major releases remains a significant problem at the time of writing, but there are plans to make this much more manageable through improvements to **blueprints** and adding **migrations**.

Listed below are some examples of changes that would qualify for different version increments. This is not an exhaustive list, and if you find more examples you're encouraged to add to this! But hopefully it will serve as a useful reference and help in gaining intuition for which increment to use.

Note that if you're including multiple changes in a single release, you should always pick the highest increment.

### Major bump

Major version bumps are used for breaking changes. Specifically, this means when an older version of a template cannot automatically be upgraded to a newer version without breaking it, and _without noticeably changing how the template looks or behaves_.

- Adding, removing or renaming a data table.
- Removing a data binding.
- Changing the `key`, `dataset`, `type`, `column`, `columns` of a data binding.
- Removing a `data_type` from a data binding. Or adding `data_type` to a binding that had none before.
- Taking a data binding that was `optional` and making it required.
- Changing the default value of a setting in `template.state`.
- An existing setting's `property` is changed in `template.yml`.
- Removing support for older browsers.
- Changes are made that alter the appearance of custom HTML content.
- Changing a setting to remove/sanitize HTML content.

### Minor bump

Minor bumps are for the addition of new features that can safely be applied to older versions of the template under the same major version. In practice these behave more or less the same as a patch bump, but it is still useful to distinguish between different this release and a less impactful patch release.

- Adding a new setting, such that the default setting's value still reflects the template's current behaviour.
- Adding a new optional data binding that is unbound by default.
- Adding a new module that is disabled by default.
- Adding the annotations module to a template.

### Patch bump

Patch bumps are used for small changes that do not introduce new functionality or visibly change existing visualisations. Examples of this would include bug fixes, non-functional changes to settings and data, or making performance improvements.

- Changing the `name` or `description` of a setting.
- Changing the `name`, `description` or `assignment` of a data binding.
- Making a data binding `optional` when it previously wasn't.
- Performance improvements.
- Improving the bundle size of a template by removing unnecessary dependencies.
- Upgrading a rollup plugin that substantially changes the bundle file output, but not the template's functionality.
- Adding a new shim to support older browsers.
- Upgrading to a new patch version of a dependency.
- Refactoring a project with no behavioural changes.
- Changing the thumbnail used for the template.

Patch bumps are also useful for urgent rollbacks, as visualisations will automatically be upgraded to the rolled-back version when they're next opened. Note that you will need to support a clean upgrade both for the broken version that is being rolled back, and the versions that were working before the broken version was released.

### No bump

We're only concerned with changes that impact the creator of a visualisation or story. That means that changes that don't impact how the template looks, how data and state are stored, or improve performance often do not require an update at all.

- Adding a new test.
- Upgrading `cypress`, `mocha`, `eslint` or any of their plugins.
- Adding a new eslint rule without any substantial changes to code.
- Making changes to our CI/CD pipeline.
- Making changes to any project in the `tools` directory.
- Making changes to `@flourish/cypress`.
- Adding a new Cypress command, or changing an existing Cypress command.
- A template is still unreleased and in the `0.x.x` version range. These templates should not be published to `@flourish`, and instead should be shared using the prerelease links generated by our template PR bot.

## Managing external dependencies

Our dependencies are all also specified with SemVer ranges in `package.json` files.

Note that typically a _range_ is used, and not a _version_. when you see a `^9.3.2`, for example, what that actually means is "9.3.2, or any version above that that is still major version 9". This allows us to keep packages up to date within a safe range without usually having to think about it.

By specifying different ranges, you can choose how much you're willing to trade off between fast updates and project stability:

- `*`: always use the latest version. You will almost never want this.
- `^9.3.2`: we're okay with new features and bug fixes, but no known breaking changes.
- `~9.3.2`: we're okay with bug fixes, but don't want to risk the chance of new features interfering with existing functionality.
- `9.3.2`: we're only comfortable using this exact version until we choose to upgrade it ourselves.

A liberal approach to dependency ranges works in many cases, and we should aim to use caret ranges (e.g. `^9.3.2`) as much as is reasonably possible. There are important exceptions to this to consider, however:

- Tools that keep all of our core infrastructure and workflow running, such as `pnpm` or the Flourish SDK. Unexpected updates to these projects could halt all work or break publishing new releases, so upgrades need to be made with more caution. We will want to either pin these versions (e.g. `9.3.2`) or only accept patch updates (e.g. `~9.3.2`).
- Packages that do not respect SemVer, or projects that have consistently shipped breaking changes in non-breaking releases, such as `cypress`. These should also either be pinned or restricted to patch updates.
