import * as fs from 'fs';

const getHTMLFilesFromFolder = (dir: string) => {
    let results: string[] = [];
    fs.readdirSync(dir).forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHTMLFilesFromFolder(file))
        } else {
            results.push(file);
        }
    });
    return results.filter(f => f.endsWith('.html'));
};

fs.writeFileSync('src/files.ts', `export const files = [${getHTMLFilesFromFolder('examples').map(f => `"${f}"`)}];`);