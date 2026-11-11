When publishing a new template, or launch a major new feature in a template. Please create a new issue in the relevant repository, copy paste the template below and assign the relevant developer and Luisa to that issue. If some of the items in the checklist are not relevant for your template or feature, then leave them out.


```markdown
### Launch checklist for developers

This checklist is copied from the [Template launchlist](https://github.com/kiln/flourish-templates/wiki/Template-launchlist/).

## Template info

- [ ] The template/feature has a [one-pager](https://canvadev.atlassian.net/wiki/spaces/DV/pages/2722565096/One+pager+template) in Confluence that describes the problems this template/feature is solving as well as our proposed solution & scope.

## Developer checklist
- [ ] Template/feature contains all functionality as defined in the one-pager on Confluence
- [ ] Template functionality and features are consistent with other templates
    - [ ] Template data structure is consistent with similar templates
    - [ ] Font and UI size settings are specified in rems
    - [ ] There is a data binding for extra info in popups called "Extra info for popups"
    - [ ] Setting structure and wording follows advice outlined in the [template styleguide](https://github.com/kiln/flourish-templates/wiki/Template-styleguide)
    - [ ] Data bindings and settings that contain text content support HTML where useful
    - [ ] Any text should have settings for size and weight
    - [ ] The template supports accessibility features (auto-contrasting labels, text outlines, tabbable data points)
    - [ ] If relevant: value data binding is multi-column with filter/controls
    - [ ] If relevant: template has a filter binding
    - [ ] If relevant: data bindings that contain text content support HTML
    - [ ] If relevant: any text should have settings for size and weight
- [ ] Data types and magic have been set up
- [ ] Template/feature has RTL support
- [ ] Template/feature behaves as expected and saves visualization state when added to a story
- [ ] Template/feature works in different height modes
- [ ] Template/feature has CI set up
- [ ] Template/feature has relevant accessibility features, such as keyboard support and reduced motion support
- [ ] Template/feature passes ESLint checks
- [ ] Do any dev docs or other documentation that mention this template or feature need to be updated?
- [ ] Which issues will this template close?
- [ ] Template/feature works with different themes (Test with **Kiln: Candidate: Flourish Dark Test v1** and **Kiln: Candidate: Flourish Light Test v1**)
    - [ ] Template/feature looks good with scrollbars always on (System preferences » General » Show scrollbars: Always)
    - [ ] Template/feature image export works well
    - [ ] Template/feature works well in story editor
         - [ ] Setting a view in a slide saves
         - [ ] Switching back and forth between slides and refreshing continues to keep the visualization state saved
         - [ ] Animations on slide change work smoothly / as expected
         - [ ] Annotations (where relevant) can be set and are saved in the correct position
    - [ ] Template/feature works well in fixed height mode
    - [ ] Any errors that occur are flagged as GitHub issues in the template repository
- [ ] Code tests passed
    - [ ] Cypress launchlist passed
    - [ ] Other Cypress tests passed
    - [ ] Template is browser tested
        - [ ] Tested in (via LambdaTest or own machine)
            - [ ] IE 11
            - [ ] Mobile device (iOS and Android device with touchscreen)
            - [ ] Firefox (most recent version)
            - [ ] Safari (most recent version)
            - [ ] Chrome (most recent version)
            - [ ] Edge (most recent version)
    - [ ] Automated screenshot test of published viz (via Lambdatest)

```

_There are two Android tablets and a Windows laptop in the office. Please contact Daan if you require more QA devices_

### Cypress

Every template should have a [Cypress](https://github.com/kiln/flourish-cypress) test running that should go through all datasets and data bindings, and test it with different kind of data formats. This is to check (i) whether things are broken and (ii) when we supply bad data, does the template fail gracefully, or does it simply crash? Is there a way to signpost to the user what's going wrong?

Each Cypress test should do the following:

* Run the launchlist
* Have custom tests if there's a particular part of template you want to test (eg. beeswarm in scatter)

### LambdaTest

There are 2 types of LambdaTest modes: Real Time and Screenshot testing. You can find those modes in the sidebar:

![Screenshot 2021-06-21 at 15 29 44](https://user-images.githubusercontent.com/3636117/122770343-a4211380-d2a5-11eb-9338-a85c6c4ee8e7.png)

For the screenshot test, this is the recommended list of devices/browsers to test with (you can save the list by clicking the star button):

- Windows 10: IE11, latest Chrome, Firefox and Edge,
- MacOS: Latest Chrome, Latest Firefox, Latest Safari (and second-to last),
- iOS: Iphone 8, Iphone X, Ipad Pro
- Android: Samsung Galaxy S10E, Google Pixel 3

# UX launchlist


```markdown
### Launch checklist for product team

This checklist is copied from the [Template Launchlist](https://github.com/kiln/flourish-templates/wiki/Template-launchlist/).

## Template info

- [ ] The template/feature has a [one-pager](https://canvadev.atlassian.net/wiki/spaces/DV/pages/2722565096/One+pager+template) in Confluence that describes the problems this template/feature is solving as well as our proposed solution & scope.

## UX checklist

- [ ] The template/feature meets its functionality aims (as defined in the onepager)
- [ ] Setting structure and wording follows advice outlined in the template styleguide
- [ ] Settings have descriptions where relevant
- [ ] Missing features have been logged as issues to GitHub and/or to JIRA
- [ ] Features that seem too complicated/advanced have been logged as issues to GitHub and/or to JIRA
- [ ] The flow of visualization creation with this template makes sense and causes for confusion or suggestions for simplification have been added as GitHub or JIRA issues
- [ ] Template/feature functionality and UX make sense to users
- [ ] Template/feature has been tested with a few real-life datasets
- [ ] Template/feature has been tested with different combinations of settings and datasets
- [ ] Tried to break the template/setting with different combinations of settings and data, and didn't succeed
- [ ] The template/feature meets accessibility standards and is usable by individuals with disabilities
- [ ] Any accessibility issues have been logged as issues in the template repo and/or to JIRA
- [ ] Cross-browser and cross-platform compatibility testing
- [ ] Security review and addressing potential vulnerabilities
- [ ] Handover with content & marketing / enablement teams has been scheduled
- [ ] Help docs have been created or updated (request help doc updates in #help-doc-request)
- [ ] Template has relevant default data (in collaboration with enablement and content/marketing)
- [ ] Template has relevant thumbnail.png (in collaboration with enablement and content/marketing)
- [ ] Template has relevant blueprints (in collaboration with enablement and content/marketing)
- [ ] There is a GTM plan prepared for showcasing the template / new feature (in collaboration with content/marketing)
- [ ] Training materials on the template have been created (in collaboration with enablement)

## Before launch

- [ ] Guide (Template showcase page) is updated with content from overview help doc (in collaboration with enablement)
- [ ] Setting descriptions have been updated with links to overview help doc

## After launch

- [ ] The accessibility features table has been updated
- [ ] The changelog has been updated

```