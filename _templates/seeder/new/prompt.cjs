// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
	{
		type: "input",
		name: "name",
		message: "Seeder name",
	},
	{
		type: "input",
		name: "seederPath",
		message: "Path from packages",
	},
];
