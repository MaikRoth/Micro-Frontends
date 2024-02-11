const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    module: {
        rules: [
           
        ]
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'robot',
            filename: 'remoteEntry.js',
            exposes: {
                './Robot': './src/index'
            }
        })
    ]
}