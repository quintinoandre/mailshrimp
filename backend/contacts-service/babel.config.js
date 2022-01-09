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
					'@controllers': './src/controllers',
					'@models': './src/models',
					'@routes': './src/routes',
					'@ms-commons': '../__commons__/src',
				},
			},
		],
	],
	ignore: ['**/*.spec.ts'],
};
