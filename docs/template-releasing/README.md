# Template releasing and versioning

Read this guidance before choosing a template version, changing compatibility,
writing release notes, or publishing a template. The `wiki/` directory contains
unchanged Markdown copies from the
[templates wiki](https://github.com/kiln/flourish-templates/wiki).

## Start here

- [Semantic Versioning](wiki/Semantic-Versioning.md): major, minor, patch and no-bump
  examples; compatibility rules; dependency version ranges.
- [How to publish and update templates and modules](wiki/How-to-publish-and-update-templates-and-modules.md):
  publishing commands, version zero, release notes, major-release prerequisites,
  module and bulk releases, rollbacks, and beta releases.

For standalone templates built with this starter kit, apply the compatibility and
versioning rules and publish to the user's own account. A new optional feature
must preserve existing behaviour by default to qualify for a minor bump. Changes
to state defaults, binding keys or data tables can require a major bump. Keep
`package.json` and `RELEASE_NOTES.md` consistent, marking breaking changes with
`[BREAKING]`, and test upgrades using a visualisation created with the old version.

The copied pages also describe the Flourish team's internal release process.
Commands involving `pnpm publisher`, the release bot, `--as flourish`, `--as bespoke`,
superuser access, the admin panel and team communications apply to that workflow;
they are not prerequisites for publishing a user's standalone SDK template. Use
them only when the task concerns that workflow and the user has authorised it.

## Related release guidance

- [Blueprints](wiki/Blueprints.md): creation, updates and major-version lifecycle.
- [How blueprints are migrated](wiki/How-blueprints-are-migrated.md): why major
  versions need a prerelease, verification, and recovery from missed migrations.
- [How to deal with a PR train](wiki/How-to-deal-with-a-PR-train.md): combining
  breaking changes into one major release and finalising versions and release notes.
- [Template launchlist](wiki/Template-launchlist.md): developer and product checks
  for new templates and major features.
- [Working with the monorepo](wiki/Working-with-the-monorepo.md): workspace
  dependency versions, publisher validation and release-history commands.
- [PR review Git workflow](wiki/PR-review-Git-workflow.md): when to update release
  notes and versions before merging.
- [GitHub Actions and template development](wiki/GitHub-Actions-and-template-development.md):
  CI and release-validation context.
- [Updating Start With Data configs](wiki/Updating-Start-With-Data-Configs-(cop-task).md):
  keeping chart-chooser configurations compatible with new template major versions.

## Source and maintenance

Copied on **2026-11-11** from `kiln/flourish-templates.wiki` at commit
`d54badbde13a0c0f0d47d9c605cb0e3f63fffd25`. Each filename in `wiki/` matches its
source filename; its upstream page is
`https://github.com/kiln/flourish-templates/wiki/<filename without .md>`.
Links and images inside those copies still point to their original destinations
and may require access to internal services.

These are snapshots, including any historical advice or stale links in the wiki.
For a release, check the upstream pages and installed SDK help for changes. If
these sources disagree with the starter kit, flag the discrepancy before choosing
release steps. To refresh the snapshot, fetch the wiki, review changes to these
ten pages and any newly relevant release pages, copy the Markdown unchanged, and
update the date and commit above.
