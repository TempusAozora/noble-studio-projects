const contextMenu = document.getElementById("context-menu");

function openContextMenu(event, i) {
    event.stopPropagation();

    contextMenu.style.display = "flex";
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;
}

function hideContextMenu(event) {
    if (!contextMenu.contains(event.target)) contextMenu.style.display = "none";
}