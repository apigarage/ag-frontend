== Public Environments ==
==========================
Filename: environments.json

This file represents public (or shared) environments. It's available to anyone with the repository access.

```
{
	vars: [ // Arrays will take care of the sequence as well.
		{
			uuid: "varsUUID1",
			name: "varName1", // ie. access-token, default-user-email, default-user-password
			description: "variableDescription", // ie. Required for all oAuth calls 
		},
		{
			uuid: "varsUUID2",
			name: "varName2", // ie. access-token, default-user-email, default-user-password
			description: "variableDescription", // ie. Required for all oAuth calls 
		}
	],
	environments: [ // Arrays will take care of the sequence as well.
		{
			uuid: "environmentUUID1",
			name: "envrionmentName1", // ie. Staging, Production, Local
			description: "environmentDescription", // ie. This is a staging environment

		},
		{
			uuid: "environmentUUID2",
			name: "envrionmentName2", // ie. Staging, Production, Local
			description: "environmentDescription", // ie. This is a staging environment

		}
	],
	values: {
		environmentUUID1:{
			varsUUID1: "value11" // 
			varsUUID2: "value12" // 
		},
		environmentUUID2:{
			varsUUID1: "value21" // 
			varsUUID2: "value22" // 
		}
	}
]
```

== Private Environments ==
==========================
Filename: environments.private.json

Note: Don't forget to .gitignore environments.private.json inside the private file.

This file represents private environments, only available to the file owner.

```
{
	vars: [ // Arrays will take care of the sequence as well.
		{
			uuid: "varsUUID1",
			name: "varName1", // ie. access-token, default-user-email, default-user-password
			description: "variableDescription", // ie. Required for all oAuth calls 
		},
		{
			uuid: "varsUUID2",
			name: "varName2", // ie. access-token, default-user-email, default-user-password
			description: "variableDescription", // ie. Required for all oAuth calls 
		}
	],
	environments: [ // Arrays will take care of the sequence as well.
		{
			uuid: "environmentUUID1",
			name: "envrionmentName1", // ie. Staging, Production, Local
			description: "environmentDescription", // ie. This is a staging environment

		},
		{
			uuid: "environmentUUID2",
			name: "envrionmentName2", // ie. Staging, Production, Local
			description: "environmentDescription", // ie. This is a staging environment

		}
	],
	values: {
		environmentUUID1:{
			varsUUID1: "value11" // 
			varsUUID2: "value12" // 
		},
		environmentUUID2:{
			varsUUID1: "value21" // 
			varsUUID2: "value22" // 
		}
	}
]
```