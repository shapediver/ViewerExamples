import * as fs from 'fs';
import { getParameters } from 'codesandbox/lib/api/define';
import marked from 'marked';

const data = fs.readFileSync('package.json', 'utf8')

// Parse package.json content to JSON
const packageJson = JSON.parse(data);

// Get the version field
const viewerVersion = packageJson.dependencies['@shapediver/viewer'];

const homeButton = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" /><style> #home-button { font-size: 4em; cursor: pointer; } </style>'
const gitHubButton = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><style> #gitHub-button { font-size: 4em; cursor: pointer; } </style>'
const descriptionButton = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><style> #description-button { font-size: 4em; cursor: pointer; } </style>'
const codeSandBoxButton = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><style> #codeSandBox-button { font-size: 4em; cursor: pointer; } </style>'

const homeButtonSpan = `<span id="home-button" class="material-symbols-outlined" onclick="window.open(window.location.origin + '/index.html', '_self')"> home </span>`

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

const createCodeSandBoxUrl = (directory: string) => {
    // get other files in the directory
    const fileNames = getFileNames(directory);

    const files: { [key: string]: { content: string, isBinary: boolean } } = {};

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i].replace(directory + '/', '');
        if (fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.css') || fileName.endsWith('.json') || fileName.endsWith('.html')) {
            const content = fs.readFileSync(fileNames[i], 'utf-8');
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
            dependencies: {
                "@shapediver/viewer": viewerVersion,
                "@shapediver/viewer.features.attribute-visualization": viewerVersion,
                "@shapediver/viewer.features.interaction": viewerVersion,
            }
        } as unknown as string,
        isBinary: false
    };

    const parameters = getParameters({ files });

    return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
}

/**
 * Get all HTML files from a folder
 * 
 * @param dir 
 * @returns 
 */
const getHTMLFilesFromFolder = (dir: string) => {
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            getHTMLFilesFromFolder(file);
        } else {
            // check if the name of the file is example.html
            if (file.endsWith('example.html')) {
                // read the file
                const content = fs.readFileSync(file, 'utf-8');

                // get the directory of the file
                const parts = file.split('/');
                const directory = parts.slice(1, parts.length - 1).join('/');

                // add the home button to the file
                let newContent = content.replace('<head>', `<head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">${homeButton}${codeSandBoxButton}${gitHubButton}${descriptionButton}`);

                const gitHubButtonSpan = `<span id="gitHub-button" class="material-symbols-outlined" onclick="window.open('https://github.com/shapediver/ViewerExamples/blob/development/${directory}/src/index.ts')"> code </span>`;
                const codeSandBoxButtonSpan = `<span id="codeSandBox-button" class="material-symbols-outlined" onclick="window.open('${createCodeSandBoxUrl(directory)}')"> deployed_code </span>`;

                newContent = newContent.replace('<body>', `<body><div style="position: absolute; bottom: 0%; left: 0%; margin: 8px; z-index: 1; ">${homeButtonSpan}</div>`);
                newContent = newContent.replace('<body>', `<body><div style="position: absolute; bottom: 0%; right: 0%; margin: 8px; z-index: 1; ">${codeSandBoxButtonSpan}${gitHubButtonSpan}</div>`);

                // check if there is a README.md file in the directory
                if (fs.existsSync('dist/' + directory + '/README.md')) {
                    const descriptionButtonSpan = `<span id="description-button" class="material-symbols-outlined" onclick="toggleDiv()"> description </span>`;
                    const toggleFunction = `<script> function toggleDiv() { const div = document.getElementById("readmeDiv"); if (div.style.display === "none") { div.style.display = "block"; } else { div.style.display = "none"; } } </script>`;
                    const descriptionDiv = `<div style="position: absolute; top: 0%; left: 0%; margin: 8px; z-index: 1; ">${descriptionButtonSpan}</div>`;
                    const readMeContent = fs.readFileSync('dist/' + directory + '/README.md', 'utf-8');
                    // convert markdown to html
                    const readmeDiv = `<div id="readmeDiv" style="position: absolute; top: 58px; left: 0%; margin: 8px; z-index: 1; display: none; background-color: white; padding: 8px; max-width: 50%; max-height: 80%; overflow-y: scroll;"><div>${marked.parse(readMeContent)}</div></div>`;
                    newContent = newContent.replace('<body>', `<body>${toggleFunction}${descriptionDiv}${readmeDiv}`);
                }

                // write the file
                fs.writeFileSync(file, newContent);
            }
        }
    });
};

// Write the files to a file
getHTMLFilesFromFolder('dist');