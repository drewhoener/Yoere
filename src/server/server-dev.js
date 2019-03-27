import path from "path";
import express from "express";
import webpack from 'webpack';
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "../../webpack.dev.config.js";

const compiler = webpack(config);
const app = express(), STATIC = __dirname, STATIC_HTML = path.join(STATIC, 'index.html');
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(express.static(STATIC));

app.get('*', (req, res, next) => {
    compiler.outputFileSystem.readFile(STATIC_HTML, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end()
    })
});

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
    console.log(`Press Ctrl + C to quit`);
});