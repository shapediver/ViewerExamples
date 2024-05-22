/**
 * Adds the header content to the document
 * 
 * Adds:
 * - Semantic UI CSS
 * - Google Fonts for the buttons
 * - Styles for the buttons
 * - Styles for the button containers
 * 
 * @param document 
 * @param head 
 */
export const addHeaderContent = (document: Document, head: HTMLHeadElement) => {
    const plausibleScript = document.createElement('script') as HTMLScriptElement;
    plausibleScript.defer = true;
    plausibleScript.setAttribute('data-domain', 'viewer.shapediver.com');
    plausibleScript.src = 'https://viewer.shapediver.com/js/script.outbound-links.tagged-events.js';
    head.appendChild(plausibleScript);

    const headerLink = document.createElement('link');
    headerLink.rel = 'stylesheet';
    headerLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css';
    head.appendChild(headerLink);

    const homeButton = document.createElement('link');
    homeButton.rel = 'stylesheet';
    homeButton.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
    head.appendChild(homeButton);

    const gitHubButton = document.createElement('link');
    gitHubButton.rel = 'stylesheet';
    gitHubButton.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    head.appendChild(gitHubButton);

    const descriptionButton = document.createElement('link');
    descriptionButton.rel = 'stylesheet';
    descriptionButton.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    head.appendChild(descriptionButton);

    const codeSandBoxButton = document.createElement('link');
    codeSandBoxButton.rel = 'stylesheet';
    codeSandBoxButton.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    head.appendChild(codeSandBoxButton);

    const buttonStyleSheet = document.createElement('style');
    buttonStyleSheet.innerHTML = '.button { font-size: 1.25em; cursor: pointer; padding-right: 0.5rem; }';
    head.appendChild(buttonStyleSheet);

    const buttonContainerStyleSheet = document.createElement('style');
    buttonContainerStyleSheet.innerHTML = '.button-container { position: absolute; margin: 8px; z-index: 1; }';
    head.appendChild(buttonContainerStyleSheet);
}

const createFormSubmit = (document: Document, id: string, parameters: string): HTMLFormElement => {
    const form = document.createElement('form') as HTMLFormElement;
    const input = document.createElement('input') as HTMLInputElement;
    const inputInner = document.createElement('input') as HTMLInputElement;
    
    form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
    form.method = 'POST';
    form.target = '_blank';
    form.style.display = 'none';
    
    input.type = 'hidden';
    input.name = 'parameters';
    input.value = parameters;
    
    inputInner.type = "submit";
    inputInner.id = `form_${id}`;
    inputInner.style.display = "none";
    inputInner.value = "Create CodeSandbox";
    
    form.appendChild(input);
    form.appendChild(inputInner);

    return form;
}

const capitalizeFirstLetter = (string: string) => {
    if (string.length === 0) {
        return string; // Return empty string if input is empty
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const createButtonSpan = (document: Document, id: string, name: string, text: string, url: string) => {
    const a = document.createElement('a');

    a.style.background = 'white';
    a.style.border = 'lightgrey solid 0.1rem';
    a.style.borderRadius = '2rem';
    a.style.padding = '0.5rem 1rem';
    a.style.display = 'flex';
    a.style.justifyContent = 'space-between';
    a.style.boxShadow = 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px';
    a.style.color = 'black';
    a.style.margin = '0.5rem';
    a.style.cursor = 'pointer';

    a.id = id;
    a.className = `plausible-event-name=${id} plausible-event-example=${name}`;
    if(url.startsWith('window.open') || url.startsWith('function')) {
        a.setAttribute('onclick', url);
    } else {
        const formSubmit = createFormSubmit(document, id, url);
        a.setAttribute('onclick', `document.getElementById('form_${id}').click()`);
        a.appendChild(formSubmit);
    }

    const innerSpan = document.createElement('span');
    innerSpan.style.display = 'flex';
    innerSpan.style.alignItems = 'self-start';
    innerSpan.style.fontSize = 'large';
    innerSpan.style.fontWeight = 'bold';
    innerSpan.style.justifyContent = 'space-between';
    a.appendChild(innerSpan);

    const span = document.createElement('span');
    span.className = `material-symbols-outlined button`;
    span.innerHTML = text;
    innerSpan.appendChild(span);

    const p = document.createElement('p');
    p.style.margin = '0';
    p.style.fontSize = 'medium';
    p.innerHTML = capitalizeFirstLetter(id.replace('-button', ''));
    innerSpan.appendChild(p);

    return a;
}


/**
 * Creates the corner containers for the buttons
 * 
 * @param document 
 * @param body 
 * @returns 
 */
export const createCornerContainers = (document: Document, body: HTMLHeadElement) => {
    const topLeftDiv = document.createElement('div');
    topLeftDiv.id = 'topLeftDiv';
    topLeftDiv.className = "button-container";
    topLeftDiv.style.top = '1.5rem';
    topLeftDiv.style.left = '1.5rem';
    topLeftDiv.style.display = 'flex';
    body.appendChild(topLeftDiv);

    const topRightDiv = document.createElement('div');
    topRightDiv.id = 'topRightDiv';
    topRightDiv.className = "button-container";
    topRightDiv.style.top = '1.5rem';
    topRightDiv.style.right = '1.5rem';
    topRightDiv.style.display = 'flex';
    body.appendChild(topRightDiv);
    
    const bottomLeftDiv = document.createElement('div');
    bottomLeftDiv.id = 'bottomLeftDiv';
    bottomLeftDiv.className = "button-container";
    bottomLeftDiv.style.bottom = '1.5rem';
    bottomLeftDiv.style.left = '1.5rem';
    bottomLeftDiv.style.display = 'flex';
    body.appendChild(bottomLeftDiv);

    const bottomRightDiv = document.createElement('div');
    bottomRightDiv.id = 'bottomRightDiv';
    bottomRightDiv.className = "button-container";
    bottomRightDiv.style.bottom = '1.5rem';
    bottomRightDiv.style.right = '1.5rem';
    bottomRightDiv.style.display = 'flex';
    body.appendChild(bottomRightDiv);

    return { topLeftDiv, topRightDiv, bottomLeftDiv, bottomRightDiv };
}