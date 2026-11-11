This page describes the Git workflow when creating, reviewing and merging a PR.

## Prepare for review

* once the feature/fix is implemented, rebase to `main` branch (`git rebase main`)
* tidy commits (to make it easier and clearer to review)
* push your branch to Github
* in Jira move to the Engineering Review Queue

## After each round of review feedback:

* if any changes are required add them as new commits and push (i.e. don't modify existing commits)
* if `main` branch has changed since your previous push, merge from main using `git pull origin main`
* push new commits to Github
* (repeat these steps after each round of review feedback)

## After PR has been approved:

* update release notes and version number
* do a final merge from 'main' branch (`git pull origin main`) if necessary
* push new commits to Github
* in Github, click the `Squash and merge` button (this combines all your commits into a single commit and merges it into `main` branch)

## Branch Protection Rules
As of 19//12/2024, administrators cannot bypass branch protection rules. All pushes to `main` must go through a pull request and pass required checks.

### Location of the Setting to change it and allow direct pushes to main
To adjust this option:
1. Go to **Settings** > **Branches** > **Branch Protection Rules**.
2. Locate the `main` branch rules.
3. Toggle the **"Include administrators"** option to bypass protections for admin users.
