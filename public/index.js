const path = window.location.pathname
const directories = path.split("/").slice(1);

const icons = {
    file: `<img src="/icons/file-solid-full.svg" alt="file">`,
    folder: `<img src="/icons/folder-solid-full.svg" alt="folder">`
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

window.files.forEach(file => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${file.isDir ? icons.folder : icons.file}<span>${file.name}</span></td>
        <td>${(new Date(file.createdAt)).toLocaleDateString('en-US')}</td>
        <td>${(new Date(file.lastModified)).toLocaleDateString('en-US')}</td>
        <td>${!file.isDir ? file.size : "-"} ${!file.isDir? "B" : ""}</td>
        <td>${file.owner}</td>
    `

    tr.addEventListener('dblclick', (event) => {
        const url = new URL(window.location.href);
        url.pathname = url.pathname.replace(/\/$/, '') + '/' + file.name;
        window.location.href = url.toString();
    })
    document.getElementById("dir-content").appendChild(tr);
});

if (!window.pathExists) {
    document.getElementById("main-tbl").innerHTML = `<h3>404 file or directory not found.</h3>`
}

if (window.pathExists && !window.isDir) {
    document.getElementById("main-tbl").innerHTML = `<h3>File viewer work in progress.</h3>`
}