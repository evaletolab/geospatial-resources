var webpack=require('webpack');
module.exports = {
    entry: "./index.js",
    output: {
        path: 'dist',
        filename: "bundle.js"
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
          mangle: {
            except: ['exports', 'require','_']
          }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                APP_ENV: JSON.stringify('browser'),
            },
        })
    ]
};