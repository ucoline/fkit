const path = require('path')
const Fkit = require('fkit-core')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtract = require('mini-css-extract-plugin')

var config = {
    entry: {
        common: [
            './src/app/entries/common.js',
            './src/app/entries/common.scss'
        ],
        theme: [
            './src/app/entries/theme.js',
            './src/app/entries/theme.scss'
        ],
    },
    devServer: {
        hot: false,
        open: true,
    },
    watchOptions: {
        ignored: ['**/public', '**/node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(css|less|s[ac]ss)$/,
                use: [
                    {
                        loader: MiniCssExtract.loader,
                        options: { esModule: false }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: './src/utils/postcss-config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ],
            },
            {
                test: /\.scss/,
                loader: 'import-glob-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts/',
                            publicPath: '../fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/',
                            publicPath: '../images/'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.html$/i,
                exclude: /node_modules/,
                loader: "html-loader",
                options: {
                    esModule: false
                }
            },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendors'
                },
            }
        }
    },
    resolve: {
        alias: {
            '~': path.resolve('node_modules')
        }
    },
    performance: {
        maxAssetSize: 999999999,
        maxEntrypointSize: 999999999
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname, 'public/assets'),
            }]
        }),
    ]
}

module.exports = (env, argv) => {
    const fileName = {
        js: '[name].js',
        css: '[name].css',
    }

    if (argv.mode === 'development') {
        config.entry.dev = path.resolve(__dirname, 'src/utils/dev.js');
        config.devtool = 'source-map';
        config.mode = 'development';
        fileName.css = 'assets/css/[name].css';
        fileName.js = 'assets/js/[name].js';
    }

    if (argv.mode === 'production') {
        config.mode = 'production';
        fileName.css = 'assets/css/[name].min.css';
        fileName.js = 'assets/js/[name].min.js';
    }

    config.output = {
        filename: fileName.js,
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        clean: true,
    }

    config.plugins.push(new MiniCssExtract({
        filename: fileName.css,
        chunkFilename: fileName.css,
    }));

    config.plugins.push(new Fkit({
        env: argv.mode,
        path: path.resolve(__dirname),
    }));

    return config;
}