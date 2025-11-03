// Make the DIV element draggable:
// Target the `#welcome` container so its header (`#welcomeheader`) can be used to drag it.
dragElement(document.getElementById("welcome"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (element && document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
    // also support touch
    document.getElementById(element.id + "header").addEventListener('touchstart', startDragging, {passive: false});
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse or touch cursor position at startup.
    var clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    var clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

    // Convert any transform-based centering (e.g. translate(-50%,-50%)) into
    // explicit top/left pixel values so changing top/left during dragging doesn't
    // interact with the transform and change the element's size/position unexpectedly.
    var rect = element.getBoundingClientRect();
    // Set pixel top/left relative to the document (include page scroll)
    element.style.left = (rect.left + window.scrollX) + 'px';
    element.style.top = (rect.top + window.scrollY) + 'px';
    // Remove transform so top/left are the authoritative position.
    element.style.transform = 'none';

  // Lock the element width to its current pixel width while dragging so
  // it doesn't expand or reflow when moved near the viewport edges.
  element.style.width = rect.width + 'px';
  element.style.boxSizing = 'border-box';
  // Optionally cap width so it remains visible on small viewports
  element.style.maxWidth = '90vw';

    initialX = clientX;
    initialY = clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
    // touch support
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('touchmove', elementDrag, {passive: false});
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position (supports touch and mouse).
    var clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    var clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    currentX = initialX - clientX;
    currentY = initialY - clientY;
    initialX = clientX;
    initialY = clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
    // remove touch listeners we added
    document.removeEventListener('touchend', stopDragging);
    document.removeEventListener('touchmove', elementDrag);
    // Clear the inline width so the element can return to its natural size
    // after the user finishes dragging.
    element.style.width = '';
    element.style.maxWidth = '';
  }
}



var welcomeScreen = document.querySelector("#welcome")

function closeWindow(element) {
  element.style.display = "none"
}
