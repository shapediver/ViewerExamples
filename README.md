# Viewer 3 - project setup example

To recreate this setup:
- `npm init -y`
- `npm i -save @shapediver/viewer`
- `npm i -save-dev webpack webpack-cli typescript ts-loader`
- add `src/index.ts` with 
```
import 'reflect-metadata';
import { api, Session, Viewer } from "@shapediver/viewer";

(async () => {
    let session: Session = await api.createAndInitializeSession({ ticket: 'd7275c4a686c2df9ba75ca6c7e05dc674ae60912c1aa75e478f273dab718cd20b2a269073e03b5810daaf461c82ad990b176d3071776ec0f80fa034bb1e2bc6ee6c99fc82764ad55157bcba7dd1856b18eb0390e2b83c201be16e51de33c356fc6ad73cb3100eeecd3fc48ea5405e7f1c2272088d7-ff5d231fc13c2098c7ed85e51331760e', modelViewUrl: 'https://sdeuc1.eu-central-1.shapediver.com', id: 'mySession' });
    let viewer: Viewer = await api.createAndInitializeViewer({ canvas: <HTMLCanvasElement>document.getElementById('canvas'), id: 'myViewer' })
})();
```
- add `webpack.config.js` with
```
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
```
- add `tsconfig.json` with
```
{
    "compilerOptions": {
        "outDir": "./dist/",
        "module": "es6",
        "target": "es5",
        "moduleResolution": "node",
    }
}
```
- add `dist/index.html` with
```
<!DOCTYPE html>
<html style="height: 100%">

<head>
    <title>ShapeDiver</title>
</head>

<body style="margin: 0px; overflow-y: hidden; height: 100%">
    <div style="width: 100%; height: 100%;">
        <canvas id="canvas" style="display: block"></canvas>
    </div>
    <script type="module" src="./bundle.js"></script>
</body>

</html>
```
- create a new script in `package.json` with `webpack --config webpack.config.js` and call that script