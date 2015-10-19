WORK IN PROGRESS
================


* package.json file on the rackspace server.
 ** source of truth
 ** links to all the latest installers (three)
 ** link to the latest update
 ** one file for staging (in it's own folder)
 ** one file for production (in it's own folder)
 ** Always use this file to find out about latest package version.

* On releasing installer:
 ** Upload a versioned build. Call it version1.installer
 ** Copy that to apigarage.installer.

* On rolling back installer:
 ** Find the asked version build. If found,
 ** Copy that to apigarage.installer.

* On releasing update:
 ** Upload a versioned build. Call it version1.update
 ** Copy that to apigarage.update.

* On rolling back update:
 ** Find the asked version build. If found,
 ** Copy that to apigarage.update.
