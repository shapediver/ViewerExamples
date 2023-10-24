import { files } from './files';

const ul = document.createElement('ul');

files.forEach(file => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = file.replace('/index.html', '');
    a.href = file;
    li.appendChild(a);
    ul.appendChild(li);
});

document.body.appendChild(ul);
