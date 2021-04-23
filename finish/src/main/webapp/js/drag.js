let dragSrcEl = null;
let dragCount = 0;
function handleDragStart(e) {
    if(this.draggable === true) {
        // Target (this) element is the source node.
        dragSrcEl = this;
        console.log("Drag " + dragCount + " start");
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragElem');
    }
}
function handleDragOver(e) {
    if(this.draggable === true) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        this.classList.add('over');
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
    }
}
function handleDragEnter(e) {
    if(this.draggable === true) {

    }
    // this / e.target is the current hover target.
}
function handleDragLeave(e) {
    if(this.draggable === true) {
        this.classList.remove('over');  // this / e.target is previous target element.
    }
}
function handleDrop(e) {
    if(this.draggable === true) {
        // this/e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl !== this) {
            // Set the source column's HTML to the HTML of the column we dropped on.
            this.parentNode.removeChild(dragSrcEl);
            const dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin', dropHTML);
            const dropElem = this.previousSibling;
            addDnDHandlers(dropElem);
        }
        this.classList.remove('over');
        this.classList.remove('dragElem');
        refreshDragOrder();
        console.log("Drag " + dragCount + " End");
        dragCount++;
        return false;
    }
}
function handleDragEnd(e) {
    if(this.draggable === true) {
        this.classList.remove('over');
    }
}
function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragenter', handleDragEnter, false)
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);
}