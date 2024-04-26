import * as fs from 'fs';
import { createCodeSandBoxParameters, createGithubUrl } from './linkCreation';
import marked from 'marked';

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
        githubUrl: string,
        description?: string
    }[] = [];
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHTMLFilesFromFolder(file))
        } else {
            if (file.endsWith('example.html')) {
                // get the directory of the file
                const parts = file.split('/');
                const directory = parts.slice(0, parts.length - 1).join('/');

                let description = '';
                if (fs.existsSync(directory + '/description.txt')) {
                    description = fs.readFileSync(directory + '/description.txt', 'utf-8')
                }

                results.push({
                    href: file,
                    codeSandBoxUrl: createCodeSandBoxParameters(directory, dependencies, packageJson),
                    githubUrl: createGithubUrl(directory),
                    description
                });
            }
        }
    });
    return results;
};

/**
 * Get all markdown files from a folder
 * 
 * @param dir 
 * @returns 
 */
const getMarkdownFilesFromFolder = (dir: string) => {
    let results: {
        markdown: string,
        path: string
    }[] = [];
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getMarkdownFilesFromFolder(file))
        } else {
            if (file.endsWith('README.md')) {
                // get the directory of the file
                const parts = file.split('/');
                const directory = parts.slice(0, parts.length - 1).join('/');

                // if there is an example.html file in the directory, the markdown is used directly
                if (!fs.existsSync(directory + '/example.html')) {
                    const markdown = fs.readFileSync(file, 'utf-8');
                    const markdownText = marked.parse(markdown) as string;

                    results.push({
                        markdown: markdownText,
                        path: file.replace('README.md', '')
                    });
                }
            }
        }
    });
    return results;
}

// Write the files to a file
fs.writeFileSync('src/input.ts', `
    export const files = ${JSON.stringify(getHTMLFilesFromFolder('examples'))};
    export const markdownFiles = ${JSON.stringify(getMarkdownFilesFromFolder('examples'))};
`);