const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        content_script: './src/content_script',
        background: './src/background',
        devtools: './src/devtools',
        shader_editor: './src/shader_editor',
        injected_script: './src/injected_script',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new CopyWebpackPlugin([
            './src/devtools.html',
            './src/shader_editor.html',
            './src/manifest.json'
        ]),
    ],
};
