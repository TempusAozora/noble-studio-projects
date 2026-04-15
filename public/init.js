const path = window.location.pathname;
const directories = path.split("/").slice(2); // ignore 1st index and root path

const icons = {
    file: `<img src="/icons/file-solid-full.svg" alt="file">`,
    folder: `<img src="/icons/folder-solid-full.svg" alt="folder">`,
    ellipsis_vertical: `<img src="/icons/ellipsis-vertical-solid-full.svg" alt="folder">`
}

for (const dir of directories) {
    if (dir.trim() === "") continue;
    const li = document.createElement("li");
    const baseHref = path.split(`${dir}`)[0];

    li.innerHTML = `
        <a href="${baseHref}${dir}">${decodeURIComponent(dir)}</a>
    `
    document.getElementById("dirs").appendChild(li);
}

for (let i = 0; i < window.files.length; i++) {
    const file = window.files[i];

    const tr = document.createElement("tr");
    tr.dataset.idx = i;

    tr.innerHTML = `
        <td>${file.isDir ? icons.folder : icons.file}<span>${file.name}</span></td>
        <td>${(new Date(file.createdAt)).toLocaleDateString('en-US')}</td>
        <td>${(new Date(file.lastModified)).toLocaleDateString('en-US')}</td>
        <td>${!file.isDir ? file.size : "-"} ${!file.isDir? "B" : ""}</td>
        <td>${file.owner}</td>
        <td class="details">${icons.ellipsis_vertical}</td>
    `

    tr.lastElementChild.addEventListener('click', (event) => {
        openContextMenu(event, file);
    });
    tr.addEventListener('dblclick', ()=>{ openFileOrDir(file.name) });

    tr.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        openContextMenu(event, file);
        return false;
    })
    document.getElementById("dir-content").appendChild(tr);
}

document.body.addEventListener("click", (event) => {
    hideContextMenu(event);
})

if (!window.pathExists) {
    document.getElementById("main-tbl").innerHTML = `<h3>File or directory not found.</h3>`
}

if (window.pathExists && !window.isDir) {
    document.getElementById("main-tbl").innerHTML = `<h3>File viewer work in progress.</h3>`
}