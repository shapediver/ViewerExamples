
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
    return `https://github.com/shapediver/ViewerExamples/blob/development/${directory}/src/index.ts`;
}

/**
 * Create a codesandbox url for a directory
 * The dependencies are extracted from the files in the directory
 * 
 * @param directory 
 * @param dependencies 
 * @param packageJson 
 * @returns 
 */
export const createCodeSandBoxUrl = (directory: string, dependencies: { [key: string]: string }, packageJson: any) => {
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
        content: {
            dependencies: dep
        } as unknown as string,
        isBinary: false
    };

    const parameters = getParameters({ files });

    return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
}