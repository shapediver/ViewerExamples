import * as fs from 'fs';
import marked from 'marked';
import { JSDOM } from 'jsdom';
import { addHeaderContent, createCornerContainers, createButtonSpan } from './htmlCreation';
import { createGithubUrl, createCodeSandBoxParameters } from './linkCreation';

const data = fs.readFileSync('package.json', 'utf8')

// Parse package.json content to JSON
const packageJson = JSON.parse(data);

// Get the version field
const dependencies = packageJson.dependencies;

/**
 * Get all HTML files from a folder and add the HTML content
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

                // create a DOM object
                const dom = new JSDOM(content);
                const document = dom.window.document;

                // get the head and body elements
                const head = document.querySelector('head') as HTMLHeadElement;
                const body = document.querySelector('body') as HTMLBodyElement;

                // get the directory of the file
                const parts = file.split('/');
                const directory = parts.slice(1, parts.length - 1).join('/');

                // add the header content
                addHeaderContent(document, head);

                // create the button containers
                const { topLeftDiv, topRightDiv, bottomLeftDiv, bottomRightDiv } = createCornerContainers(document, body);

                // get second to last part
                const name = parts[parts.length - 2];

                // create the buttons
                const homeButtonSpan = createButtonSpan(document, 'home-button', 'home', name, `window.open(window.location.href.substring(0, window.location.href.lastIndexOf('/examples/')) + '/index.html', '_self')`);
                bottomLeftDiv.appendChild(homeButtonSpan);

                const gitHubButtonSpan = createButtonSpan(document, 'gitHub-button', name, 'code', `window.open("${createGithubUrl(directory)}", '_blank')`);
                const codeSandBoxButtonSpan = createButtonSpan(document, 'codeSandBox-button', name, 'deployed_code', createCodeSandBoxParameters(directory, dependencies, packageJson));
                bottomRightDiv.appendChild(codeSandBoxButtonSpan);
                bottomRightDiv.appendChild(gitHubButtonSpan);

                // check if there is a README.md file in the directory
                if (fs.existsSync(directory + '/README.md')) {
                    const descriptionButtonSpan = createButtonSpan(document, 'description-button', 'description', name, `function toggleDiv() { const div = document.getElementById('readmeDiv'); if (div.style.display === 'none') { div.style.display = 'block'; } else { div.style.display = 'none'; } } toggleDiv();`);
                    topLeftDiv.appendChild(descriptionButtonSpan);

                    // read the README.md file
                    const readMeContent = fs.readFileSync(directory + '/README.md', 'utf-8');

                    // create a div element for the README.md content
                    const readmeDiv = document.createElement('div');
                    readmeDiv.id = 'readmeDiv';
                    readmeDiv.style.cssText = 'position: absolute; top: 58px; left: 0%; margin: 8px; z-index: 1; display: none; background-color: white; padding: 8px; max-width: 50%; max-height: 80%; overflow-y: scroll;';
                    readmeDiv.innerHTML = marked.parse(readMeContent) as string;
                    body.appendChild(readmeDiv);
                }

                // write the file
                fs.writeFileSync(file, dom.serialize());
            }
        }
    });
};

const copyImageFiles = (dir: string) => {
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            copyImageFiles(file);
        } else {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif')) {
                const parts = file.split('/');
                const directory = parts.slice(0, parts.length - 1).join('/');

                // check if the directory exists
                if (!fs.existsSync('dist/' + directory)) {
                    fs.mkdirSync('dist/' + directory, { recursive: true });
                }

                fs.copyFileSync(file, 'dist/' + directory + '/' + parts[parts.length - 1]);
            }
        }
    });
};

// Write the files to a file
getHTMLFilesFromFolder('dist');

// Copy the image files
copyImageFiles('examples');