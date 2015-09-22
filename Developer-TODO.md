Purpose:
========
This file contains the list of changes required in the architecture.


Use Services In Place of $rootScope
===================================
Currently, we are using $rootScope for all the communication between controllers
and services. It makes it simple for now, but pollutes the $rootScope. Figure
out how to watch for changes in the Service variables.


PromptCtrl should be a directive
================================
Prompt Controller should be a directive. It would be very easy to manage that way.

$rootScope.currentItem should be upadted only from the broadcast listener
=========================================================================
Prompt Controller should be a directive. It would be very easy to manage that way.

<<<<<<< HEAD
Remove Collection and Items from Projects.js and transfer in relevant places.
=========================================================================
Projects.js Service has many not functions which belongs to Collections.js
or Items.js or any other services.

UUID into a Core Service
================================
UUID into a Core Service


Always Return a promise
========================
Wherever we are returning false, or other values, we should be returning the promise.
