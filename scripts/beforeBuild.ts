import * as fs from 'fs';
import { createCodeSandBoxUrl, createGithubUrl } from './linkCreation';

const data = fs.readFileSync('package.json', 'utf8')

// Parse package.json content to JSON
const packageJson = JSON.parse(data);

// Get the version field
const dependencies = packageJson.dependencies;

/**
 * Get all HTML files from a folder
 * 
 * @param dir 
 * @returns 
 */
const getHTMLFilesFromFolder = (dir: string) => {
    let results: {
        href: string,
        codeSandBoxUrl: string,
        githubUrl: string
    }[] = [];
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHTMLFilesFromFolder(file))
        } else {
            if(file.endsWith('example.html')) {
                // get the directory of the file
                const parts = file.split('/');
                const directory = parts.slice(0, parts.length - 1).join('/');

                results.push({
                    href: file,
                    codeSandBoxUrl: createCodeSandBoxUrl(directory, dependencies, packageJson),
                    githubUrl: createGithubUrl(directory)
                });
            }
        }
    });
    return results;
};

// Write the files to a file
fs.writeFileSync('src/files.ts', `export const files = ${JSON.stringify(getHTMLFilesFromFolder('examples'))};`);