# Publishing and versioning your template

This guide is for templates you build with this starter kit and publish to your
own Flourish account.

## Publish and test

Run commands from your template's root directory.

1. Log in with `flourish login`. Use `flourish whoami` to check the account.
2. Check that `template.yml` has a unique `id` for your template. Reuse that ID
   when updating the same template; choose a new ID for a different template.
3. Set the intended version in `package.json`. The starters use this file for
   their version; avoid adding a competing `version` in `template.yml`.
4. Run `flourish run` and check the template in the local preview.
5. Publish a test version with `flourish publish --prerelease`. Open the URL it
   prints, upload your own data in Studio's Data tab, and check settings and
   bindings. The local preview has no Data tab.
6. When the prerelease is ready, run `flourish publish --release` to remove the
   prerelease suffix and publish the release.

`flourish publish` publishes the version configured in your template.
`--prerelease` changes that version before publishing; inspect the resulting
version rather than assuming it only appends a suffix. `--release` removes an
existing prerelease suffix; it does not choose the next major, minor or patch
version for you. To test a specific intended release, set an explicit prerelease
such as `1.1.0-prerelease.1` in `package.json` and use `flourish publish`.

Use `1.0.0` for your first release. For later releases, choose the version using
the rules below before publishing. Review and commit version changes made by the
SDK along with your template changes.

## Choose the next version

Versions use `MAJOR.MINOR.PATCH`, for example `1.2.3`. If a release contains
several changes, use the highest increment required. Minor and patch updates
must preserve existing visualisations' appearance, behaviour, data and settings.
Existing visualisations do not automatically upgrade to a new major version.

### Major: breaking changes

For example, `1.2.3` becomes `2.0.0`.

The wiki gives these examples of changes requiring a major bump:

- Adding, removing or renaming a data table.
- Removing a data binding, or changing its `key`, `dataset`, `type`, `column`
  or `columns`.
- Removing a `data_type` from a binding, or adding `data_type` where none existed.
- Making an optional binding required.
- Changing a default value in the exported template `state`.
- Changing an existing setting's `property` in `template.yml`.
- Removing browser support.
- Altering the appearance of custom HTML, or removing/sanitising HTML content
  accepted by a setting.

### Minor: compatible new features

For example, `1.2.3` becomes `1.3.0`.

- Add a setting whose default preserves existing behaviour.
- Add an optional data binding that is unbound by default.
- Add a module that is disabled by default.

### Patch: compatible fixes and maintenance

For example, `1.2.3` becomes `1.2.4`.

- Fix a bug without introducing new functionality or visibly changing existing
  visualisations.
- Change a setting or binding's display name or description.
- Change a binding's `assignment`, or make a required binding optional.
- Improve performance or bundle size, or refactor without behavioural changes.
- Update a patch dependency version while preserving template behaviour.

Changes only to tests or development tooling generally need no template release.

## Check compatibility before releasing

When unsure whether an update is compatible:

1. Publish the previous version to your own account and create a visualisation.
2. Change some settings and data bindings, and save it.
3. Publish the proposed update and reopen the saved visualisation.
4. Check that its data, settings, appearance and interactions still work.

Keep a `RELEASE_NOTES.md` with an entry for each release, using the same version
as `package.json`. Describe the changes and mark breaking entries with
`[BREAKING]` so users know when they may need to recreate a visualisation.

To undo a broken compatible release, restore the working code and publish it
with a new, higher patch version. Check that it handles visualisations saved
with both the broken version and the earlier working version.

## Sources

Adapted from the publishing commands, semantic version numbering and compatibility
checks in [How to publish and update templates and modules](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules),
and the template version-bump examples in [Semantic Versioning](https://github.com/kiln/flourish-templates/wiki/Semantic-Versioning).
Source wiki commit: `d54badbde13a0c0f0d47d9c605cb0e3f63fffd25`, read on
2026-11-11. These source links may require repository access; the applicable
guidance is included above.

For SDK command details, use `flourish help publish` and the
[public developer documentation](https://developers.flourish.studio/).
