import * as fs from 'fs';

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
            if(file.endsWith('example.html')) {
                // read the file
                const content = fs.readFileSync(file, 'utf-8');
                // add the home button to the file
                let newContent = content.replace('<head>', '<head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" /><style> #home-button { position: absolute; font-size: 4em; cursor: pointer; z-index: 1; } </style>');
                newContent = newContent.replace('<body>', `<body><span id="home-button" class="material-symbols-outlined" onclick="window.open(window.location.origin + '/index.html', '_self')"> home </span>`);
                // write the file
                fs.writeFileSync(file, newContent);
            }
        }
    });
};

// Write the files to a file
getHTMLFilesFromFolder('dist')