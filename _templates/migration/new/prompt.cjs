// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
	{
		type: "input",
		name: "name",
		message: "Migration name",
	},
	{
		type: "input",
		name: "migrationPath",
		message: "Path from packages",
	},
];
