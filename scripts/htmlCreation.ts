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
    buttonStyleSheet.innerHTML = '.button { font-size: 4em; cursor: pointer; }';
    head.appendChild(buttonStyleSheet);

    const buttonContainerStyleSheet = document.createElement('style');
    buttonContainerStyleSheet.innerHTML = '.button-container { position: absolute; margin: 8px; z-index: 1; mix-blend-mode: difference; filter: invert(1) grayscale(100%); }';
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

/**
 * Creates a button span element
 * 
 * @param document 
 * @param id 
 * @param text 
 * @param url 
 * @returns 
 */
export const createButtonSpan = (document: Document, id: string, name: string, text: string, url: string) => {
    const span = document.createElement('span');
    span.id = id;
    span.className = `material-symbols-outlined button plausible-event-name=${id} plausible-event-example=${name}`;
    span.innerHTML = text;
    if(url.startsWith('window.open') || url.startsWith('function')) {
        span.setAttribute('onclick', url);
    } else {
        const formSubmit = createFormSubmit(document, id, url);
        span.setAttribute('onclick', `document.getElementById('form_${id}').click()`);
        span.appendChild(formSubmit);
    }
    return span;
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
    topLeftDiv.style.top = '0%';
    topLeftDiv.style.left = '0%';
    body.appendChild(topLeftDiv);

    const topRightDiv = document.createElement('div');
    topRightDiv.id = 'topRightDiv';
    topRightDiv.className = "button-container";
    topRightDiv.style.top = '0%';
    topRightDiv.style.right = '0%';
    body.appendChild(topRightDiv);
    
    const bottomLeftDiv = document.createElement('div');
    bottomLeftDiv.id = 'bottomLeftDiv';
    bottomLeftDiv.className = "button-container";
    bottomLeftDiv.style.bottom = '0%';
    bottomLeftDiv.style.left = '0%';
    body.appendChild(bottomLeftDiv);

    const bottomRightDiv = document.createElement('div');
    bottomRightDiv.id = 'bottomRightDiv';
    bottomRightDiv.className = "button-container";
    bottomRightDiv.style.bottom = '0%';
    bottomRightDiv.style.right = '0%';
    body.appendChild(bottomRightDiv);

    return { topLeftDiv, topRightDiv, bottomLeftDiv, bottomRightDiv };
}