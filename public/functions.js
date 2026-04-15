const contextMenu = document.getElementById("context-menu");

function openContextMenu(event, fileData) {
    event.stopPropagation();

    contextMenu.style.display = "flex";
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;

    document.getElementById("open").href = getFileOrDir(fileData.name);
    document.getElementById("download").href = getDownloadPath(fileData.name);
}

function hideContextMenu(event) {
    contextMenu.style.display = "none";
}

function getFileOrDir(name) {
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/\/$/, '') + '/' + name;
    return url.toString()
}

function openFileOrDir(name) {
    const href = getFileOrDir(name);
    window.location.href = href;
}

function getDownloadPath(name) {
    return `${getFileOrDir(name)}?download=1`;
}