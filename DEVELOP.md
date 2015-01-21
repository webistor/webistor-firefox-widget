webistor-firefox-widget development
===================================

## Debug the addons during development

You'll want to locate your [profile folder](http://support.mozilla.com/en-us/kb/Profiles#How_to_find_your_profile). Once you find it, go into the folder called 'extensions', and then locate the folder for the add-on you are working on. Replace that folder with a file of the same name, and inside the file place the full path to your source directory of the add-on. As long as you don't use jar files inside your add-on, you will no longer have to rebuild ([this is covered in a bit more depth here](https://developer.mozilla.org/en/Setting_up_extension_development_environment#Firefox_extension_proxy_file)).

Additionally, you'll want to set [nglayout.debug.disable_xul_cache](http://kb.mozillazine.org/Nglayout.debug.disable_xul_cache) to true. For edits to xul or js files, you'll just have to open up a new window to see your changes instead of restarting the application. There are [other preferences here](https://developer.mozilla.org/en/Setting_up_extension_development_environment#Development_preferences) that you may find useful as well.

## How to build modified code?

Use the SDK:

1. [install the SDK locally](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation)
- get to know the cfx command line tool, with [this introductory walkthrough](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started) and the [detailed `cfx` reference](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/cfx)
- get to know the [package.json](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/package_json) file used to configure attributes of the add-on

### Packaging the add-on ([link](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started#Packaging_the_add-on))

1. Navigate to source folder: `cd source/`
- Build the XPI: `cfx xpi`
- Move the XPI file to the root of this repository
