import { markdownFiles } from "./input";
import { FolderStructure } from "./parseInput";
import { createHash } from 'crypto';

const createFormSubmit = (id: string, parameters: string): HTMLFormElement => {
    const form = document.createElement('form') as HTMLFormElement;
    const input = document.createElement('input') as HTMLInputElement;
    const inputInner = document.createElement('input') as HTMLInputElement;

    form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
    form.method = 'POST';
    form.target = '_blank';

    input.type = 'hidden';
    input.name = 'parameters';
    input.value = parameters;

    inputInner.type = "submit";
    inputInner.id = id;
    inputInner.style.display = "none";
    inputInner.value = "Create CodeSandbox";

    form.appendChild(input);
    form.appendChild(inputInner);

    return form;
}

const createId = (path: string) => {
    const id = createHash('sha256');
    id.update(path);
    return id.digest('hex');
}

/**
 * Traverse the folder structure and create a list of items
 * For each folder in the folder structure create a list item
 * 
 * @param parent 
 * @param folder 
 */
const traverseList = (parent: HTMLElement, folder: FolderStructure, path: string) => {
    for (let f in folder) {
        if (folder[f].href !== undefined) {
            // if the folder has a href it is a file
            const li = document.createElement("li");
            li.className = 'file';

            const div = document.createElement('div');
            div.className = 'button-container';

            // create a link to the file
            const a = document.createElement("a");
            a.textContent = (folder[f].name as string).replace(/-/g, ' ').replace(/_/g, ' ');
            a.style.textTransform = 'capitalize';
            a.href = folder[f].href as string;
            div.appendChild(a);

            // create an icon for the code sandbox link
            const codeSandBoxSpan = document.createElement("span");
            codeSandBoxSpan.id = 'codeSandBoxSpan-button';
            codeSandBoxSpan.className = "material-symbols-outlined button";
            codeSandBoxSpan.textContent = 'deployed_code';
            const id = createId(folder[f].codeSandBox as string);
            const formSubmit = createFormSubmit(id, folder[f].codeSandBox as string);
            codeSandBoxSpan.appendChild(formSubmit);
            codeSandBoxSpan.onclick = () => document.getElementById(id)!.click();
            div.appendChild(codeSandBoxSpan);

            // create an icon for the github link
            const gitHubSpan = document.createElement("span");
            gitHubSpan.id = 'gitHub-button';
            gitHubSpan.className = "material-symbols-outlined button";
            gitHubSpan.innerHTML = 'code';
            gitHubSpan.setAttribute('onclick', `window.open('${folder[f].github}', '_blank')`);
            div.appendChild(gitHubSpan);

            li.appendChild(div);

            // create a description for the file
            if (folder[f].description) {
                const newDiv = document.createElement('div');

                const description = document.createElement('p');
                description.textContent = folder[f].description as string;
                description.style.fontSize = 'medium';
                newDiv.appendChild(description);

                li.appendChild(newDiv);
            }

            parent.appendChild(li);
        } else {
            // if the folder does not have a href it is a folder
            const ul = document.createElement('ul');
            const li = document.createElement("li");
            li.className = 'folder';

            const currentPath = path + f + '/';

            const markdownData = markdownFiles.find((file) => file.path === currentPath);

            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            li.appendChild(div);

            let sectionName: string | undefined;
            let collapse = false;
            if (markdownData) {
                const markdownElement = document.createElement('div');
                markdownElement.innerHTML = markdownData.markdown;
                console.log(markdownData.markdown)

                // get first h3 element
                const h3 = markdownElement.querySelector('h3');
                if (h3) {
                    sectionName = h3.textContent?.replace(/-/g, ' ').replace(/_/g, ' ').toLowerCase() as string;
                    h3.textContent = sectionName;
                    h3.style.textTransform = 'capitalize';
                }

                if (markdownData.markdown.includes('<!-- collapse -->'))
                    collapse = true;

                markdownElement.style.fontSize = 'medium';
                markdownElement.style.fontWeight = 'normal';
                div.appendChild(markdownElement);
            }

            if (sectionName === undefined) {
                const paragraphElement = document.createElement('p');
                sectionName = f.replace(/-/g, ' ').replace(/_/g, ' ');
                paragraphElement.textContent = sectionName;
                paragraphElement.style.textTransform = 'capitalize';
                paragraphElement.style.marginTop = '1rem';
                paragraphElement.style.marginBottom = '0.1rem';
                div.prepend(paragraphElement);
            }

            li.id = sectionName;
            div.id = sectionName;

            if (collapse) {
                // add arrow icon
                const span = document.createElement('span');
                span.className = 'material-symbols-outlined button';
                span.textContent = 'expand_more';
                span.style.marginTop = '1rem';
                div.prepend(span);

                div.style.cursor = 'pointer';
                div.style.transform = 'translate(-18px, 0)';
                div.onclick = () => {
                    const ul = li.querySelector('ul');
                    if (ul)
                        ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
                    span.textContent = span.textContent === 'expand_more' ? 'expand_less' : 'expand_more';
                }
            }

            parent.appendChild(li);
            li.appendChild(ul);

            traverseList(ul, folder[f] as FolderStructure, path + f + '/');

            // collapse the list initially
            if (collapse) {
                const ul = li.querySelector('ul');
                if (ul)
                    ul.style.display = 'none';
            }
        }
    }

    // order the list
    const order = ['showcase', 'setup', 'session', 'viewport', 'scene tree manipulation', 'augmented reality', 'materials', 'html anchors', 'animations', 'three.js', 'general', 'interactions', 'attribute visualization'];

    // order the list
    const items = Array.from(parent.children);
    items.sort((a, b) => {
        if (a.className === b.className)
            return order.indexOf(a.id) - order.indexOf(b.id);
        return a.className === 'folder' ? 1 : -1;
    });
    items.forEach((item) => parent.appendChild(item));
}

/**
 * Create the content section of the page
 * 
 * @param parent 
 * @param folderStructure 
 */
export const createContentSection = (parent: HTMLDivElement, folderStructure: FolderStructure) => {
    // create the initial list
    const ul = document.createElement('ul');
    parent.appendChild(ul);

    traverseList(ul, folderStructure, 'examples/');
};

/**
 * Create the top section of the page
 * 
 * @param parent 
 */
export const createTopSection = (parent: HTMLDivElement) => {
    // create the header div
    const titleDiv = document.createElement('div');
    titleDiv.style.display = 'flex';
    titleDiv.style.alignItems = 'center';
    titleDiv.style.paddingBottom = '2rem';
    parent.appendChild(titleDiv);

    // create the logo
    const logo = document.createElement('img');
    logo.src = 'https://viewer.shapediver.com/v3/graphics/logo.png';
    logo.style.height = '3rem';
    logo.style.paddingRight = '1rem';
    titleDiv.appendChild(logo);

    // create the header
    const header = document.createElement('h1');
    header.innerText = 'ShapeDiver Viewer Examples';
    header.style.fontSize = 'xx-large';
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    header.style.margin = '0';

    titleDiv.appendChild(header);

    // create the main markdown element
    const markdownElement = document.createElement('div');
    markdownElement.className = 'main-markdown';
    markdownElement.innerHTML = markdownFiles.find((file) => file.path === 'examples/')!.markdown;
    markdownElement.style.fontSize = 'large';
    parent.appendChild(markdownElement);
}