// #region Type aliases (2)

/**
 * File data
 */
export type FileData = {
    folders: string[],
    name: string,
    href: string,
    codeSandBox: string,
    github: string,
    description?: string
};
/**
 * Folder structure
 */
export type FolderStructure = {
    [key: string]: FileData | FolderStructure,
}

// #endregion Type aliases (2)

// #region Variables (1)

/**
 * Create the folder structure from the files
 * 
 * @param files 
 * @returns 
 */
export const createFolderStructure = (files: {
    href: string,
    codeSandBoxUrl: string,
    githubUrl: string,
    description?: string
}[]) => {
    let folderStructure: FolderStructure = {};

    // Create the folder structure
    for (let i = 0; i < files.length; i++) {
        // Split the file path into parts
        const parts = files[i].href.split("/");

        // Create the file data
        const fileData = {
            name: parts[parts.length - 2],
            href: files[i].href,
            codeSandBox: files[i].codeSandBoxUrl,
            github: files[i].githubUrl,
            folders: parts.slice(1, parts.length - 2),
            description: files[i].description
        };

        // Add the file data to the folder structure
        let currentFolder = folderStructure;
        for (let j = 0; j < fileData.folders.length; j++) {
            if (!currentFolder[fileData.folders[j]]) {
                currentFolder[fileData.folders[j]] = {};
            }

            if (j === fileData.folders.length - 1) {
                // in the last folder add the file data
                ((currentFolder as FolderStructure)[fileData.folders[j]] as FolderStructure)[fileData.name] = fileData as FileData;
            } else {
                // go deeper into the folder structure
                currentFolder = currentFolder[fileData.folders[j]] as FolderStructure;
            }
        }
    }

    return folderStructure;
}

// #endregion Variables (1)
