**This Wiki includes sections on how to:**

 - [Publish a template](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#publishing-commands)
 - [Publish a module](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#how-to-publish-a-module--along-with-a-bulk-publish-of-the-templates-that-use-this-module)
 - [Blueprints](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#blueprints)
 - [Publish a pre-release for Beta / Test.io](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#publishing-to-share-with-the-beta-community)

## Publishing commands

Run these in the root of your template directory.

### `flourish publish`

- This will publish a template to your **@your_own_account** at the version configured in the package.json file.
- Add the option `--prerelease` to publish a prerelease version. This useful for testing purposes in **@your_own_account** and for automatically updating template blueprints to the latest major version in the **@flourish** account.
- Add the option `--local-testing` to publish to your local instance of Flourish.
- Add the option `--as flourish` to publish to the **@flourish** account. This requires [temporary Flourish Superuser access](#request-temporary-superuser-access), as well as following the steps detailed below.

For publishing a template to **@flourish** account, you'll generally be doing this using our publishing workflow and not by running the `flourish publish` command directly. The exception to this is when publishing major versions.

## Semantic version numbering

For example: `v1.2.0`

- Update the **major** number (`1`) if it's a breaking change.
- Update the **minor** number (`2`) if the new version changes the appearance/functionality significantly.
- Update the **patch** number (`0`) if it is only a minor change or bug fix.

You can read more about this and how to select the right version number to increase to on the [semantic versioning page of the wiki](https://github.com/kiln/flourish-templates/wiki/Semantic-Versioning).

If you're not sure if there's a breaking change and want to double check:

- Find the previous version of the template and publish it on your own account or local server.
- Create a visualisation with that template and change a few settings and data bindings.
- Publish the new template as a minor or patch version.
- Check the visualisation to see if it's broken or not.

If you are publishing an entirely new template use `v1.0.0`.

## Major version zero

Any projects that are on major version zero (`0.x.x`) are considered works in progress, not yet ready for publishing. They will be ignored by our automated tooling and not published automatically. This is useful in the early stages of a project's development: you can continue regularly merging this project into `main` without worrying about changes going live to users too soon.

Templates should generally be upgraded to major version one (`1.x.x`) when they first go live.

## Publishing to **@flourish**

Follow the steps below to successfully publish a template to the **@flourish** account. For any development or testing please publish to **@your_own_account**.

### Request temporary superuser access

Before publishing any template to **@flourish**, including with a bulk publish command from the release bot, request temporary **Flourish Superuser** access:

1. Type `/request` in Slack.
2. Select **Flourish Superuser** and submit the request. The request is granted automatically and can last for up to 12 hours.

Alternatively, open Lumos from Okta and submit the **Flourish Superuser** request there. Request access shortly before publishing so that it remains active for the whole release. The same access is required to use the Flourish admin panel. See the [original announcement in Slack](https://canva.slack.com/archives/C0BAT1YCUT1/p1785148154524769) for more context.

### 1. Before you merge
- Use the semantic versioning conventions above to update the template version number consistently in the following files.
	- Ensure **RELEASE_NOTES.md** is updated with a line detailing each change. If a change is breaking make sure to add `[BREAKING]` to the end of the line.
		```
		# 2.0.0
		* Upgrade @flourish/axes-highlights and /controls [BREAKING]
		* Upgrade @flourish/chart-layout, /info-popup and /layout

		# 1.2.0
		* Add controls container with alignment settings
		```
	- Ensure the `“version”` in **package.json** is updated.
		```
		{
		"name": "template-line-bar-pie",
		"version": "2.0.0",
		"description": "Flourish templates for basic charts",
		"main": "template.js",
		"author": "Kiln Enterprises Ltd",
		"license": "UNLICENSED",
		```
- Check the template author in **template.yml** is `"Flourish team"`.
- Commit these version bump changes and wait for all the tests to pass.
- Merge your PR.

### 2. MAJOR/BREAKING VERSIONS ONLY: 

> [!IMPORTANT]
> The following steps are only necessary if you are planning to publish the template with a new **major** version. If that’s not the case you can skip to **3**.

When publishing new major versions, there are some extra steps to ensure existing blueprints are successfully migrated to the new version.

First,
- Request or confirm that you have active [temporary Flourish Superuser access](#request-temporary-superuser-access)
- Check out to `main`
- `git pull`
- `pnpm i` 

#### 2.1 Publish a pre-release
- Add `-prerelease.1` to the `“version”` number in **package.json**. For instance if you’re publishing from `v1.2.0` to `v2.0.0` make sure it reads `v2.0.0-prerelease.1`.
- Now you can publish the template prerelease by running `flourish publish --as flourish`.
- Go to [https://app.flourish.studio/@examples](https://app.flourish.studio/@examples), where you should see all the blueprints of the template you published as the most recent visualisations — this means they've been successfully migrated (you can double-check the version by going into the blueprint, but don't edit the visualisation). 
- If you've made a significant change, check some of the blueprints to ensure they haven't broken. (The migration process forces blueprints to the new major version so there's a chance that changes to data binding keys, default data or existing state properties could break them). If something looks broken, we may need to try to fix the blueprints or reach out to the blueprints team in #flourish-blueprints.

#### 2.2 Remove the pre-release version and publish the real version
- Remove the `-prerelease.1` from **package.json**.
- Now publish the template by running `flourish publish --as flourish` or using the publish command provided in the pr by the release bot:

<img width="812" alt="Screenshot 2024-02-20 at 14 09 56" src="https://github.com/kiln/flourish-templates/assets/88358048/d86bef9d-f26d-406f-ab3b-988a2df6f472">

- Go to the template chooser and make sure the blueprints for the template look correct (i.e. there are no duplicates and the same set of blueprints as before your publish are visible.

> [!IMPORTANT]
> If you forgot to do this step and all the blueprints are now gone from the template chooser, you will need to:

Don't panic, this can be fixed with the admin panel 🙂  If you don't feel comfortable using the admin panel, ask someone in the template, platform, support or marketing team to help out. What we need to do is find the blueprints that are on the previous major version of the template, and manually migrate them to the latest version using the admin panel. Here's how:

- Go to the [Admin Panel](https://admin.flourish-internal.com/) and go to the **Visualisations** page.
- Filter the table on:
  - User » Username: `examples`
  - Template » External ID: the id of the template, eg. `scatter`, `line-bar-pie`, `projection-map`
  - Is blueprint: `Yes`
- It's not possible to filter the visualisations in the table on a specific version of the template, so find the ones that were most recently created, they are probably all from the same date and time.
- Open each visualisation in a new tab (admin panel can get quite slow, so this step is recommended)
- Go to the **Change template** section and open the dropdown
  - Double check that the current version of the visualisation is using the previous major version of the template (if it's not, this is not the blueprint you're looking for)
  - Find the latest version of the template, created by the Flourish team, it's usually at the top of the dropdown and has a star on the left.
  - Select the template and click the **Change template** button
  - Wait for a bit (this sometimes takes a couple of seconds) and you're done. Double check app.flourish.studio/templates to see if the changes has come through.

<img width="1126" alt="Screenshot 2024-05-22 at 14 00 49" src="https://github.com/kiln/flourish-templates/assets/3636117/6b6b9b35-2841-4df5-b9c3-f8dbf69c3757">


### 3. PATCH & MINOR VERSIONS

> [!IMPORTANT]
> If you're publishing a major version, follow step 2 above and then ignore this step.

Once you've merged your PR, first:
- Request or confirm that you have active [temporary Flourish Superuser access](#request-temporary-superuser-access)
- Check out to `main`
- `git pull`
- `pnpm i` 

Then, copy and run the publish command provided in the pr by the release bot:

<img width="812" alt="Screenshot 2024-02-20 at 14 09 56" src="https://github.com/kiln/flourish-templates/assets/88358048/d86bef9d-f26d-406f-ab3b-988a2df6f472">


### 4. Comment in #boshed
The merge will have automatically created a message in #boshed. Comment on this thread with any relevant Jira tickets and tag anyone who needs to know from other teams (e.g. CS/Enablement).

### 5. If the change means we might want some blueprints updating, post in #flourish-blueprints to let the blueprints team know.

### Now you're finally done with the publish 🎉 

<hr>

## How to publish a module — along with a bulk publish of the templates that use this module

You've updated a module, it's been reviewed and approved, and now you're ready to publish it. If you're familiar with publishing a template, you'll find this process quite similar, though it might seem a bit daunting initially. 

When you publish a module, you'll generally want to bump the versions of all templates that use that module and republish these templates at the same time.

Before starting this process...
* It's a good idea to put a message in #template-team (perhaps with an @flourish-templates) to request the team stops merging & republishing anything while you're doing your republish — otherwise it can get very fiddly with conflicts
* Ensure you're logged into npm in your terminal and have your 2FA device at hand (you'll need to provide a one-time passcode on publishing the module)


1. First, it's a good idea to rebase on `main`. This is because any publishes that have happened since you last rebased/created your branch could cause annoying conflicts when you are bumping the versions of several modules/templates.

1. Next, increase the module package version and update the release notes in the module. Commit this.

2. Then, run `pnpm publisher bump` to prompt you to choose a type of release and add generic release notes, which will then bump and add them to all the relevant templates.

3. After this step, commit the changes and push them to the branch. You should see the release bot which displays which modules and templates (and the types of release) that should be published.

4. Allow the pull request to run through automated tests and the PR bot to do its work. You should also see the publish command appear at this point. 

5. Once the tests have passed and everything looks good, merge the PR into the main branch. 

6. Following this, checkout to the `main` branch, perform a `git pull` to synchronise your local copy, and run `pnpm i` to install any dependencies. You might want to double-check a couple of templates to ensure everything is correct. Request or confirm that you have active [temporary Flourish Superuser access](#request-temporary-superuser-access) before continuing.

7. Finally, copy and paste the publish command from the PR into your terminal to publish the updated templates to the platform and update and publish the module on npm, for which you'll need your 2FA device. 

And that’s it! Everything should be updated and published, ready for use.

## How to roll back an accidental or broken publish

Published something you didn't mean to? Firstly, revert the offending commits. There's a couple of approaches to this:

``` bash
git checkout -b revert-a-release

# One approach that works well for a specific selection of commits, working
# backwards from the most recent to the least recent. This is ideal when you
# only want to revert very specific changes, such as when a project has
# already had other changes made to it.
git revert --no-commit $COMMIT_SHA_A
git revert --no-commit $COMMIT_SHA_B
git revert --no-commit $COMMIT_SHA_C
git revert --continue

# Alternatively, you can restore the state of one or more projects to an older
# point in time without impacting other projects. This is more straightforward,
# and should be okay provided there have not been any other changes to the project
# since the changes that you want to roll back were introduced 
git checkout $COMMIT_SHA -- templates/template-line-bar-pie
git commit -m "Revert most recent publish"
```

> [!TIP]
> You can use `pnpm publisher versions $PROJECT_NAME` to get a list of versions for that project, and the commit associated with each release. You can also use `git log -- $PROJECT_DIRECTORY` to see the commit history for a specific project.

Then, ensure that the versions of the projects that you want to publish match those that are currently in the `main` branch. You can do this safely by using `git checkout --patch` to change only the version numbers and stepping through each change one by one:

``` bash
git checkout origin/main -p -- */*/package.json
```

Next, do a **patch version bump** to each template that you want to update and commit those changes. You can use [pnpm filters](https://pnpm.io/filtering) to identify which projects need updating:

``` bash
# The following will print each project's directory to the terminal:
pnpm -F '[origin/main]' exec pwd
# The following will open each project's package.json file and RELEASE_NOTES in VS Code:
pnpm -F '[origin/main]' exec code package.json RELEASE_NOTES.md

git commit -m "Patch release to roll back bad commit"
```

If any dependencies have changed as part of the rollback, you will then need to make a separate commit containing an update to `pnpm-lock.yaml`:

``` bash
pnpm i
git add pnpm-lock.yaml
git commit -m 'Update pnpm-lock.yaml'
```

If you want to quickly check that every project's tests are still passing, you can use the below command to run them locally. They will run in parallel, respecting dependency order, so this can sometimes be much faster than a CI build:

``` bash
pnpm -w changed test
```

You should do a quick sense check of each changed template, running it locally and ensuring that the reverted features function as expected and that there are no major errors.

Finally, you push your branch to GitHub and make a new PR. If CI passes, you should be able to proceed with the release using the release bot as you regularly would!

> [!TIP]
> - If you published it a while ago, check for live visualisations using the wrong version of the template - if there are any, talk to Daan or Robin!
> - You can retrieve a list of template versions by commit using `pnpm publisher versions` and `pnpm publisher versions $PROJECT_NAME`.


## Publishing to share with the Beta Community

Sometimes we want to share a pre-release with our Beta community, so we can get feedback ahead of an official launch. We also follow a similar process if we want to make a pre-release available for Test.io. To do this, run `flourish publish --prerelease --as bespoke` from the directory of the template. If that doesn't work, you can also:

 - Publish a pre-release locally, using `flourish publish --prerelease`
 - Navigate to the [admin panel](https://admin.flourish-internal.com/templates), go to `Templates` and find your one. If you cant find it, try searching for your username.
<img width="1112" alt="screenshot of template in admin panel" src="https://github.com/user-attachments/assets/06b7047f-9971-4e33-85e0-cc89ecb07083">
 
 - Change the owner to `@bespoke` under `Transfer to User`. (It can sometimes take quite a while to load the options when searching)
 - Under `Private to company` clear the entry.

_Full details about the Test.io process are [on Confluence](https://canvadev.atlassian.net/wiki/spaces/DV/pages/3528098207/Testing+templates+with+test.io)_
