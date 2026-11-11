Visualisations don't upgrade automatically to new major versions. Since blueprints are just visualisations with some special properties, these also won't automatically upgrade to a new major version, but there is a mechanism to "migrate" them to the new major version which is why we follow [the process outlined here](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#breaking-changes) to ensure we don't have to recreate all the blueprints.

The relevant code for this is the `transferBlueprints` function [found here](https://github.com/kiln/flourish/blob/c5eb37b95ff509c8ed619f525ff775b75864405a/server/entity/private/template/install.js#L523).

## Why do we need this _painful_ process?

### Why publish a prerelease first?
The `transferBlueprints` function checks if you're publishing a prerelease and only runs the migration if that's true. If you tried to publish a regular release directly (without the -prerelease.1 suffix), the function would exit early and no blueprint migration would occur.

### How does the system determine which blueprints to migrate?
It finds the highest previous major version that isn't a prerelease, then copies all blueprint visualizations created with that version and migrates them to the new version.

### What happens when you publish the final version?
When you publish without the prerelease suffix, your template becomes the official new major version. Since the blueprints were already migrated during the prerelease step, they're now ready to be associated with this official release.

### Why do the pre-release blueprints not appear in the template chooser?
Prereleases are filtered out by a condition when users browse templates. This gives you a chance to verify the migration worked without exposing potentially broken examples to users.

### Why do you need to check that migrated blueprints look ok?
The migration process is automated but might not handle all edge cases perfectly, especially if the new major version has significant structural changes. Checking the blueprints ensures the migration worked properly.

## Uh-oh, I made a mistake...

### I forgot to do the prerelease publish on 20.0.0-prerelease.1 before I published 20.0.0
If you've already published 20.0.0 without doing the prerelease step first, the blueprint migration didn't happen. Either recreate the blueprints, or find the old blueprints from the previous major version, and via the admin panel you can force upgrade them to the latest version using the experimental feature and then continue the checks from there.

### I'm trying to publish new major version 20.0.0, but the latest published prerelease on @flourish is already 20.0.1
Since 20.0.1 already exists, you won't be able to publish on the lower version of 20.0.0-prerelease.1 now. 

Additionally, the migration is only triggered for new major versions, so you'll need to skip to the next major version, not just a higher patch version. In other words:

1. Update the release notes and package.json to 21.0.0 and commit these changes.

Now continue with the normal process on this new major version, e.g.

Before publishing, request or confirm that you have active [temporary Flourish Superuser access](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates-and-modules#request-temporary-superuser-access).

2. Update package.json to 21.0.0-prerelease.1 and publish with `flourish publish --as flourish`
3. Check blueprints. If all good then remove the prerelease suffix and publish as 21.0.0

