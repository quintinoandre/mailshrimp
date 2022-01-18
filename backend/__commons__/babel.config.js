module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
		'@babel/preset-typescript',
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'@auth': './src/api/auth',
					'@controllers': './src/api/controllers',
					'@routes': './src/api/routes',
				},
			},
		],
	],
	ignore: ['**/*.spec.ts'],
};
