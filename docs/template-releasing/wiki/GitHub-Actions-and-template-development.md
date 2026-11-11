We use GitHub Actions for running our tests, validating our releases, and soon publishing new modules and templates. If you're new to CI/CD, or new to GitHub Actions, it would be worth reading [Learn GitHub Actions](https://docs.github.com/en/actions/learn-github-actions).

## Glossary

* **Continuous Integration (CI)**: this describes the practice of automatically running builds and tests against the code as changes are made. It works most effectively when combined with good test coverage and frequent merges into `main`.
* **Continuous Delivery (CD)**: building on top of CI, Continuous Delivery is the practice of frequent and streamlined deployments, using a single shared branch as the target. Ideally, the deployment process is automated.

## Helpful resources

* [GitHub Actions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) adds some useful features that make it easier to work on Actions.
* [GitHub Actions documentation](https://docs.github.com/en/actions)
  * [Learn GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) is a good starting point
  * [Using a matrix for your jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
  * [Caching dependencies to speed up workflows](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
* [Improving the Github Actions caching effectiveness](https://saveriomiroddi.github.io/Improving-the-Github-Actions-caching-effectiveness)