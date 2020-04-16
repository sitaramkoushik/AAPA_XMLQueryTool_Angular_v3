const nodeEnv = process.env.NODE_ENV


module.exports = {
	// Example setup for your project:
	// The entry module that requires or imports the rest of your project.
	// Must start with `./`!
	entry:'./src/app/app.component.ts',
	// Place output files in `./dist/my-app.js`
	output: {
		path: __dirname + '/dist',
		filename: 'my-app.js',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader'
			},
		],
	},
	mode: 'development'
};
