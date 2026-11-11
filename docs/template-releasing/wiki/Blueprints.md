## Blueprints

Blueprints are the starting points listed in our template chooser. They are visualisations that are duplicated into a user’s profile when clicked on. Blueprints are generally now managed by another team who you can contact in #flourish-blueprints.

Reasons blueprints might require updating include:

- Changes to default data because it was out of date / no longer relevant.
- When a new version of a template is released, the blueprints are migrated across.automatically. Sometimes this causes issues and we then need to recreate the blueprints.
- A new chart type was added.
- Certain settings have changed.

### Creating a new blueprint

- Make sure the template you're creating a blueprint for isn't on a prerelease – if it is, it won't show up as a blueprint.
**Note:** when a template hasn’t yet launched the blueprints need to be created on a pre-release link as the template page isn’t yet live. As long as the pre-release is the version popping on the [latest](https://app.flourish.studio/@flourish/line-bar-pie/latest) link of the template, then it is okay to build blueprints there.
- Create a viz that should serve as a blueprint. Change as few settings as possible (users might not know where to find and tweak them).
- Make sure the theme is set to “No theme”.
- Duplicate it to **@examples** (hello@flourish.studio)
- Using the [admin panel bookmarklet](https://githu-com/kiln/flourish-admin-bookmarklet), click through to the admin panel.
- On the viz page in the admin panel, select the "Blueprint" checkbox.
![flourish-publish-guide-01](https://user-images.githubusercontent.com/15940061/207413994-86a46bbc-2ab8-4484-9dea-a9cec21acff7.png)
- Back in the app, hover over the arrow next to the name of the viz and select “Save as blueprint”.
![flourish-publish-guide-02](https://user-images.githubusercontent.com/15940061/207414026-1ad3b3c4-1078-43c5-b73e-27740e246f34.png)
- Click upload a thumbnail image (which you can create by screenshotting or downloading) to set a thumbnail image. (If the thumbnail doesn’t look in line with other already existing ones, you might have to edit it in Figma).
![flourish-publish-guide-03](https://user-images.githubusercontent.com/15940061/207414086-124de7b7-1802-44a2-b8f7-0ac30c8b38e8.png)
- Add a description starting with the name of the blueprint in bold and the description after two break tags – like this:
	```
	<strong>Area chart (proportional)</strong><br><br> Compare multiple series in percentage terms
	```
- Check how the blueprint looks in the [template chooser](https://app.flourish.studio/templates). If you’re making a new blueprint for a template that isn’t yet featured but is in the Flourish account, you should be able to view your new blueprints in the “All by Flourish” section.
- Done! Note the blueprint will only show up publicly if the template is featured (this can also be set in the admin panel page of a template) and the viz is public (that’s why it’s important we duplicate it to hello@flourish.studio)
- Add the image URL, the viz ID or URL and the source URLs, the date and the version number to this [Google sheet](https://docs.google.com/spreadsheets/d/11xz4heyTKDydaoclYIPTDhBds7HEMw-PRe4qseWb4cU/edit#gid=0) so we can track changes and have version control.

### Updating an existing blueprint

- Go to the [template chooser](https://app.flourish.studio/templates).
- Click on your admin bookmarklet. Underneath the existing blueprints, you should see a new line of text appear: “Go to blueprint”.
![flourish-publish-guide-04](https://user-images.githubusercontent.com/15940061/207414134-bb0c7681-2309-4853-a3dc-9b99ab9d05c7.png)
- Click on this link and make the changes you need to make. Keep in mind it’s not possible to change data bindings of a viz that doesn’t belong to you. That means if you’d like to update the column selection, you should impersonate @examples / hello@flourish.studio via the admin panel first.
- Make sure any changes are logged in this [Google sheet](https://docs.google.com/spreadsheets/d/11xz4heyTKDydaoclYIPTDhBds7HEMw-PRe4qseWb4cU/edit#gid=0) so we have version control and know what changed when.

### What happens to blueprints when a template’s version is updated?

Let’s say if we update a template with new major version (a “major” version change means that the first digit of the version number has changed, eg. from `v1.2.0` to `v2.0.0`). What exactly happens with the templates and blueprints? Let’s take an example of a template that’s currently on version `v1.2.0`, and we’re going to update to `v2.0.0`.

- If we release a new **major** version, we always publish it as a prerelease first, so in this example we publish the template on `v2.0.0-prerelease.1`.
- When we publish the new **major** version on a prerelease, it means the new version is “under the radar”, in the template chooser and template showcase page the template still shows the old version `1.2.0`. The only way to see `v2.0.0-prerelease.1` is to go to the template showcase page and add “/latest” to the url. So at this point no users will be able to see version `2.0.0-prerelease.1`.
- A nice side effect of publishing a **major** version on a prerelease, is that all the blueprints from the old version (`1.2.0`) will be magically duplicated and moved over to the new version. Again, no users will see this, and the blueprints on the template chooser still use version `1.2.0`.
- So this means we can double check the blueprints, make some changes if we want to, before we show it to our users. And if we’re all happy, we’re going to publish the new version of the template from a prerelease to a “proper” release. So in this case from version `2.0.0-prerelease.1` to version `2.0.0`. Once we’ve done this, the template chooser and showcase page will now show version `2.0.0` and all the blueprints we’ve created and edited have automatically moved over from version `2.0.0-prerelease.1` to version `2.0.0` and show up in the template chooser.

### Some things to pay attention to for map blueprints specifically

- Check if there are any errors in the console.
![flourish-publish-guide-05](https://user-images.githubusercontent.com/15940061/207414179-82b1a38b-5631-4e7a-8caf-83ccdae90668.png)
- Replace “-99” with blanks.
- Some countries might have corrupted diacritics, e.g. “Qu?n ??o B?c Mariana”, if you import from Excel – you can avoid this by merging in this version that has non-corrupted diacritics instead: Non-corrupted diacritics.
- If a region only has three points, it will be removed and throw an error. To avoid this, you can replace the three-point regions with the polygons in this version: High-resolution regions.

