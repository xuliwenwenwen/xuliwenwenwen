const path = require('path');

module.exports = {
	mode: 'production',
	cache: true,
	devtool: 'source-map',
	entry: './js/master.js',
	output: {
		path: path.join(__dirname, '/dist/js'),
		publicPath: `/wp-content/themes/${path.basename(__dirname)}/dist/js/`,
		filename: 'master.min.js',
		chunkFilename: '[name].bundle.js'
	},
	resolve: {
		modules: ['node_modules']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(dom7|swiper|imagebuddy)\/).*/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
				}
			}
		]
	}
};
