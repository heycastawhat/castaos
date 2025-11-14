// Make the DIV element draggable:
// Target the `#welcome` container so its header (`#welcomeheader`) can be used to drag it.
// Initialize dragging for elements only if they exist in the DOM.
var _welcomeEl = document.getElementById("welcome");
if (_welcomeEl) dragElement(_welcomeEl);

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



var welcomeScreen = document.querySelector("#welcome");

function closeWindow(element) {
  if (!element) return;
  element.style.display = "none";
}

// Simple icon selection helpers (guarded and non-throwing)
var selectedIcon = null;
function selectIcon(element) {
  if (!element) return;
  if (selectedIcon && selectedIcon !== element) deselectIcon(selectedIcon);
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (!element) return;
  element.classList.remove("selected");
  if (selectedIcon === element) selectedIcon = null;
}

function handleIconTap(element) {
  if (!element) return;
  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    selectIcon(element);
  }
}

// Initialize dragging for optional notes element if present
var _notesEl = document.querySelector("#notes");
if (_notesEl) dragElement(_notesEl);

// Hide notes by default on load
if (_notesEl) {
  _notesEl.style.display = 'none';
}

// Initialize and hide stats window by default
var _statsEl = document.querySelector('#stats');
if (_statsEl) {
  dragElement(_statsEl);
  _statsEl.style.display = 'none';
}

var biggestIndex = 1;

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}
function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
}
function openWindow(element) {
  if (!element) return;
  element.style.display = 'block';
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
}

var topBar = document.querySelector("#topbar")

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon)
}

/**
 * Attach close button behavior to a window element by id.
 * Looks for a close control inside the window and wires it to hide the window.
 */
function makeClosable(elementName) {
  if (!elementName) return;
  var screen = document.getElementById(elementName);
  if (!screen) return;
  // find a close control inside the window (button with aria-label="Close")
  var closeBtn = screen.querySelector('#window-controls button[aria-label="Close"]');
  if (!closeBtn) return;
  // ensure clicking the close button doesn't start a drag
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeWindow(screen);
  });
  // keyboard support
  closeBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      closeWindow(screen);
    }
  });
}

/**
 * Initialize a named window: add tap handling, make closable and enable dragging.
 */
function initializeWindow(elementName) {
  if (!elementName) return;
  var screen = document.querySelector('#' + elementName);
  if (!screen) return;
  // Add z-index bringing behavior
  addWindowTapHandling(screen);
  // Wire close button
  makeClosable(elementName);
  // Enable dragging
  dragElement(screen);
}

// initialize known windows
initializeWindow('welcome');
initializeWindow('notes');
initializeWindow('stats');

// Initialize and hide photo window by default (same behavior as notes/stats)
var _photoEl = document.querySelector('#photo');
if (_photoEl) {
  initializeWindow('photo');
  _photoEl.style.display = 'none';
}

// Wire the desktop notes icon to open the notes window (click and keyboard)
var notesIcon = document.getElementById('notesIcon');
if (notesIcon) {
  notesIcon.addEventListener('click', function(e) {
    var notes = document.getElementById('notes');
    if (!notes) return;
    openWindow(notes);
  });
  notesIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var notes = document.getElementById('notes');
      if (!notes) return;
      openWindow(notes);
    }
  });
}

// Wire the stats icon
var statsIcon = document.getElementById('statsIcon');
if (statsIcon) {
  statsIcon.addEventListener('click', function(e) {
    var stats = document.getElementById('stats');
    if (!stats) return;
    openWindow(stats);
  });
  statsIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var stats = document.getElementById('stats');
      if (!stats) return;
      openWindow(stats);
    }
  });
}

// Wire the photo icon (click + keyboard) to open the photo window
var photoIcon = document.getElementById('photoIcon');
if (photoIcon) {
  photoIcon.addEventListener('click', function(e) {
    var photo = document.getElementById('photo');
    if (!photo) return;
    openWindow(photo);
  });
  photoIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var photo = document.getElementById('photo');
      if (!photo) return;
      openWindow(photo);
    }
  });
}

// Initialize and hide contact window by default
var _contactEl = document.querySelector('#contact');
if (_contactEl) {
  initializeWindow('contact');
  _contactEl.style.display = 'none';
}

// Wire the contact icon (click + keyboard) to open the contact window
var contactIcon = document.getElementById('Contact');
if (contactIcon) {
  contactIcon.addEventListener('click', function(e) {
    var contact = document.getElementById('contact');
    if (!contact) return;
    openWindow(contact);
  });
  contactIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var contact = document.getElementById('contact');
      if (!contact) return;
      openWindow(contact);
    }
  });
}

// Initialize and hide about window by default
var _aboutEl = document.querySelector('#About');
if (_aboutEl) {
  initializeWindow('About');
  _aboutEl.style.display = 'none';
}

// Wire the about icon (click + keyboard) to open the about window
var aboutIcon = document.getElementById('About');
if (aboutIcon) {
  aboutIcon.addEventListener('click', function(e) {
    var about = document.getElementById('About');
    if (!about) return;
    openWindow(about);
  });
  aboutIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var about = document.getElementById('About');
      if (!about) return;
      openWindow(about);
    }
  });
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element)
    openWindow(window)
  } else {
    selectIcon(element)
  }
}