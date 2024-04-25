import { createTopSection, createContentSection } from './createSections';
import { files } from './input';
import { createFolderStructure } from './parseInput';

// Parse the input files
const folderStructure = createFolderStructure(files);

// Create the top section
const divTop = document.getElementById('top') as HTMLDivElement;
createTopSection(divTop);

// Create the content section
const divContent = document.getElementById('content') as HTMLDivElement;
createContentSection(divContent, folderStructure);