**What is a PR train?**

A PR train involves more than one PR that are connected to each other, whereby one PR should be merged into another and the train continues until the final PR will be merged into `main`.

For example, given 3 PRs — A, B, and C — A will be merged into B which will be merged into C which will then be merged into `main`.

The PR train is a common concept within Canva. They are also known as PR chains or stacked PRs. The Canva documentation on PR trains can be found [here on Confluence](https://canvadev.atlassian.net/wiki/spaces/~nick.w/pages/2837152121/On+PR+Trains).

**When might you use a PR train (in the Flourish world)?**

If more than one PR that involves a breaking change in a template or module are ready to be merged at the same time, a PR train allows you to combine the release into one major release.

Given that visualizations need to be manually recreated when a major version is released, there is an advantage to combining breaking changes into a single update. By combining PRs with breaking changes into one release all the functionality in that release will be made available to users at once, lessening the need for users to remake their visualizations in new versions of a template.

**When is a PR train not a good idea?**

PR trains are only useful in certain circumstances and otherwise can cause more confusion. You probably want to avoid them if, when considering an individual PR in the train, the answer to any of the following questions is "Yes":
1. Is the change non-breaking?(i.e. patch or minor)
    > A PR train is **only** beneficial for combining breaking changes into a single release. Existing visualizations will automatically update to the latest version for non-breaking changes anyway, so there's no reason to make a PR train for these kinds of releases.
2. Will waiting for all PRs in the train to be ready delay any of the individual PRs for a long time (i.e. perhaps any longer than a week or two)?
    > Unexpected delays in releasing one of the changes will introduce delays to the other changes in a PR train. Holding up a PR unnecessarily could lead to more confusing rebases if it becomes out of date with `main` for longer than it needs to be. If there's a chance something might get held up, it's better to aim for smaller changes as early as possible with individual PRs rather than bigger, harder to manage releases in a PR train.
3. Does the functionality in one of the early PRs depend on changes in a PR later in the train? (For example with PRs A > B > C, does B rely on changes in C)
    > In the Flourish context, it's typically only advisable to use PR trains for the purpose of combining breaking changes into one major release. Generally speaking, functionality in one PR should not therefore rely on another PR — in this case they should remain in one single PR. When one PR relies on another, the earlier PR might not pass tests on its own, it could break if for some reason the later PR doesn't get merged in at the same time, and it could be difficult to review, particularly if different people are reviewing each PR.

**How to manage a PR train?**

If you've decided a PR train is the best option, here is some guidance on how to manage one.

1. Get your individual PRs ready — Are they all individually passing CI? Have they been fully reviewed and any requested changes made?

2. Decide on which order the PRs should be merged into each other. In the example that follows, we want to merge the branch `feature-1` into the branch `feature-2`. 

3. On Github, change the base branch in the PR for `feature-1` from `main` to `feature-2`. Do this by clicking "Edit" to the right of the PR name, then change the base branch to `feature-2`, and click "Change base" in the popup window. You should now see that the base branch is `feature-2`.
![Changing the base branch](https://github.com/kiln/flourish-templates/assets/40994811/820d94be-a736-495e-97b5-30c681da9a44)

4. You now need to rebase each branch onto the branch it will be merged into. For example, if the branch `feature-1` should be rebased onto `feature-2`:
    1. Checkout to `feature-1`
    2. Fetch the most recent changes from `feature-2`: `git fetch origin feature-2`
    3. Rebase onto `feature-2`: `git rebase -i origin/feature-2`
    4. Resolve any conflicts until you have successfully rebased
    5. Check the new commit history: `git log` or `git log --oneline` for a more condensed view. You should see the commits from `feature-2` appearing before the commits from `feature-1`
    6. If all looks good, push with force to update the remote branch: `git push --force-with-lease`

5. Check CI still passes since you rebased.
6. Now, merge the PR for `feature-1`. When you then check the PR for `feature-2` you should see the `feature-1` commits have been added to the end of its history. 
7. Repeat steps 3-6 for any more PRs in the train, other than the final PR that will be merged into `main`.
8. Once you have all of your PRs merged into each other, rebase your final PR onto `main` using a similar process as step 4:
    1. Checkout to your final branch, in our case we'll call it `feature-3`
    2. Fetch the most recent changes from `main`: `git fetch origin main`
    3. Rebase onto `main`: `git rebase -i origin/main`
    4. Resolve any conflicts until you have successfully rebased
    5. Check the new commit history: `git log` or `git log --oneline` for a more condensed view. You should see the commits from `main` appearing before the commits from `feature-3`
    6. If all looks good, push with force to update the remote branch: `git push --force-with-lease`

9. If you haven't already, you should make sure you've updated relevant version numbers and release notes. Make sure you include details about all of the changes throughout your train in the release notes. It's useful to tackle version numbers and release notes as a final step before the final merge so that:
    * They are the latest commits — in case you need to rollback changes this can make things easier.
    * With the monorepo, version numbers and release notes can become out of sync with `main` very quickly, and it can be annoying to have to resolve conflicts, especially when you are bulk republishing multiple templates and modules at once.

10. Once you've updated version numbers and release notes, check CI is passing one last time.
11. If CI is passing, you can merge your final PR in the train into `main` and following [the remaining steps for republishing the necessary templates and modules](https://github.com/kiln/flourish-templates/wiki/How-to-publish-and-update-templates#2-merge-template-into-main).