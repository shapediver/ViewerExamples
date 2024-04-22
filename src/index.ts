import { files } from './files';

type FileData = {
    folders: string[],
    name: string,
    href: string
};

type FolderStructure = {
    [key: string]: FileData | FolderStructure
}

let folderStructure: FolderStructure = {};

for(let i = 0; i < files.length; i++) {
    const parts = files[i].split("/");
    const fileData = {
        name: parts[parts.length - 2]
        href: files[i],
        folders: parts.slice(1, parts.length - 2)
    };

    let currentFolder = folderStructure;
    for(let j = 0; j < fileData.folders.length; j++) {
        if(!currentFolder[fileData.folders[j]]) currentFolder[fileData.folders[j]] = {};
        if(j === fileData.folders.length - 1) currentFolder[fileData.folders[j]][fileData.name] = fileData;
        else currentFolder = currentFolder[fileData.folders[j]]
    }
}

const ul = document.createElement('ul');

files.forEach(file => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = file.replace('/example.html', '');
    a.href = file;
    li.appendChild(a);
    ul.appendChild(li);
});

document.body.appendChild(ul);

const createList = (parent: HTMLElement, folder: FolderStructure, depth = 0) => {
    for(let f in folder) {
        console.log(f, folder[f])
        if(folder[f].href !== undefined) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = folder[f].name;
            a.href = folder[f].href;
            li.appendChild(a);
            parent.appendChild(li);
        } else {
            const ul = document.createElement('ul');
            const li = document.createElement("li");
            li.textContent = f;
            parent.appendChild(li);
            parent.appendChild(ul);
            createList(ul, folder[f])
        }
    }
}
createList(ul, folderStructure);