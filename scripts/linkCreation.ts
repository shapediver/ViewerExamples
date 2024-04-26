
import { getParameters } from 'codesandbox/lib/api/define';
import * as fs from 'fs';

/**
 * Get all file names from a directory and its subdirectories
 * 
 * @param dir 
 * @returns 
 */
const getFileNames = (dir: string): string[] => {
    const files = fs.readdirSync(dir);
    const fileNames: string[] = [];
    files.forEach(function (file) {
        const stat = fs.statSync(dir + '/' + file);
        if (stat && stat.isDirectory()) {
            fileNames.push(...getFileNames(dir + '/' + file));
        } else {
            fileNames.push(dir + '/' + file);
        }
    });

    return fileNames;
}

/**
 * Create a github url for a directory
 * 
 * @param directory 
 * @returns 
 */
export const createGithubUrl = (directory: string) => {
    return `https://github.com/shapediver/ViewerExamples/blob/development/${directory}`;
}

/**
 * Create a codesandbox parameters for a directory
 * The dependencies are extracted from the files in the directory
 * 
 * @param directory 
 * @param dependencies 
 * @param packageJson 
 * @returns 
 */
export const createCodeSandBoxParameters = (directory: string, dependencies: { [key: string]: string }, packageJson: any) => {
    // get other files in the directory
    const fileNames = getFileNames(directory);

    const files: { [key: string]: { content: string, isBinary: boolean } } = {};

    let dep: { [key: string]: string } = {};

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i].replace(directory + '/', '');
        if (fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.css') || fileName.endsWith('.json') || fileName.endsWith('.html')) {
            const content = fs.readFileSync(fileNames[i], 'utf-8');

            for (const key in dependencies) {
                if (content.includes(`'${key}'`) || content.includes(`"${key}"`)) {
                    dep[key] = packageJson.dependencies[key];
                }
            }

            if (fileName.endsWith('example.html')) {
                files['index.html'] = {
                    content: content,
                    isBinary: false
                };
            }
            else {
                files[fileName] = {
                    content: content,
                    isBinary: false
                }

            };
        }
    }

    files['package.json'] = {
        content: JSON.stringify({
            dependencies: dep,
            main: "index.html",
            scripts: {
                "start": "parcel index.html --open",
                "build": "parcel build index.html"
            },
            devDependencies: {
                "parcel-bundler": "^1.12.5",
                "typescript": "^5.4.5"
            }
        }),
        isBinary: false
    };

    files['sandbox.config.json'] ={
        content: JSON.stringify({
            "infiniteLoopProtection": true,
            "hardReloadOnChange": true,
            "view": "browser",
            "template": "parcel"
        }),
        isBinary: false
    }

    files['tsconfig.json'] = {
        content: JSON.stringify({
            "compilerOptions": {
                "module": "commonjs",
                "removeComments": false,
                "esModuleInterop": true,
                "sourceMap": false,
                "declaration": false,
                "declarationMap": false,
                "target": "ES6",
                "strict": true,
                "outDir": "dist",
                "experimentalDecorators": true,
                "emitDecoratorMetadata": true,
                "moduleResolution": "node"
            },
            "exclude": ["node_modules", "dist"]
        }),
        isBinary: false
    }

    return getParameters({ files });
}