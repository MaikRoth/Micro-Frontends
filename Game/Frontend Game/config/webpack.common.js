const { ModuleFederationPlugin } = require('webpack').container;
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  module: {
    rules: [

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'game',
      filename: 'remoteEntry.js',
      exposes: {
        './Game': './src/index',
      },
    }),
    
  ],
  
};
