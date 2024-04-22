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

// Create the folder structure
for(let i = 0; i < files.length; i++) {
    // Split the file path into parts
    const parts = files[i].split("/");

    // Create the file data
    const fileData = {
        name: parts[parts.length - 2],
        href: files[i],
        folders: parts.slice(1, parts.length - 2)
    };

    // Add the file data to the folder structure
    let currentFolder = folderStructure;
    for(let j = 0; j < fileData.folders.length; j++) {
        if(!currentFolder[fileData.folders[j]]) {
            currentFolder[fileData.folders[j]] = {};
        }

        if(j === fileData.folders.length - 1) {
            // in the last folder add the file data
            ((currentFolder as FolderStructure)[fileData.folders[j]] as FolderStructure)[fileData.name] = fileData as FileData;
        } else {
            // go deeper into the folder structure
            currentFolder = currentFolder[fileData.folders[j]] as FolderStructure;
        }
    }
}

const div = document.getElementById('main') as HTMLDivElement;

// create the initial list
const ul = document.createElement('ul');
div.appendChild(ul);

/**
 * Create the list
 * For each folder in the folder structure create a list item
 * 
 * @param parent 
 * @param folder 
 */
const createList = (parent: HTMLElement, folder: FolderStructure) => {
    for(let f in folder) {
        if(folder[f].href !== undefined) {
            // if the folder has a href it is a file
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = (folder[f].name as string).replace(/-/g, ' ');
            a.href = folder[f].href as string;
            li.appendChild(a);
            parent.appendChild(li);
        } else {
            // if the folder does not have a href it is a folder
            const ul = document.createElement('ul');
            const li = document.createElement("li");
            li.textContent = f.replace(/-/g, ' ');
            parent.appendChild(li);
            parent.appendChild(ul);
            createList(ul, folder[f] as FolderStructure)
        }
    }
}
createList(ul, folderStructure);