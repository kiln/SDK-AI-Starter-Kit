
## Context

Start With Data on the Flourish platform is a new alternative to the typical template chooser. Here a user provides their data, which is heuristically analysed by a module called `chart-chooser`, which suggests the most suitable visualisation type for the given data.

`chart-chooser` exists [in its own repository](https://github.com/kiln/chart-chooser). The owner (as of 2025-06-11) is Daan Louter.

`chart-chooser` works by having a different config file for each of the visualisation types which might be suggested to a user. These config files exist at [/src/charts/configs](https://github.com/kiln/chart-chooser/tree/main/src/charts/configs) in the `chart-chooser` repository. Part of the syntax of these config files is for the major version of the template to be specified. We ideally want the version specified in the config in `chart-chooser` to be in line with the latest major version available.

e.g.
```yml
template: "@flourish/data-explorer"
name: Data Explorer
blueprint: Default
version: 24
```

We have decided that the task of keeping these configs up to date with the latest version of the template is the responsibility of template-cop, and is to be carried out every 5 weeks. Below is a step by step guide to this process.

## Guide to updating configs

Before starting make sure you have pulled down the latest version of the `flourish-templates` and `chart-chooser` repositories.

1. Look through the merged PRs from the last 5 weeks in `flourish-templates` to determine which included a new major version for a template.
2. Identify which bindings or settings have changed in the template with this new major version
3. In the `chart-chooser` repository find the configs relating to the templates which have new major versions and update the version number in the config accordingly.
4. If any of the bindings or settings you identified in step 2 are specified in the config, these will need to be updated in the config also. Try to keep the basic function of the config the same when doing this.
5. Use the preview of the `chart-chooser` by running the command `npm run start` and navigating your browser to `http://127.0.0.1:8080/preview/`. Now you can upload a dataset to see your config in action. If it helps to see only the config in question, you can [edit the /src/index.js](https://github.com/kiln/chart-chooser/blob/bcc93972f0f5e7a139748f52168c264bcd053baf/src/index.js#L27C7-L27C21) file to specify only the templates in question.
6. When you are happy with your updated configs, raise a PR in the `chart-chooser` repository and ping Daan Louter a message to approve this.
7. Follow the [How to deploy](https://github.com/kiln/chart-chooser?tab=readme-ov-file#how-to-deploy) guide as found in the readme.
8. When this has been approved, write a message in the #platform-team slack channel, tagging also @platform-cop, explaining that there has been an update to `chart-chooser`, specify the new `chart-chooser` version number and request that platform cop update this dependency in the platform codebase.

