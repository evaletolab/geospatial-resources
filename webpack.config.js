var webpack=require('webpack');
module.exports = {
    entry: "./index.js",
    output: {
        path: 'dist',
        filename: "bundle.js"
    },
    plugins:[
			new webpack.DefinePlugin({
			    'process.env': {
			        APP_ENV: JSON.stringify('browser'),
			    },
			})

    ]
};