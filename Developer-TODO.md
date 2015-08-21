Purpose:
========
This file contains the list of changes required in the architecture.


Use Services In Place of $rootScope
===================================
Currently, we are using $rootScope for all the communication between controllers
and services. It makes it simple for now, but pollutes the $rootScope. Figure
out how to watch for changes in the Service variables.
