'use strict';

const dialog = document.querySelector('#product-dialog'); //test
const modalImage = document.querySelector('#modal-image');
const closeButton = dialog.querySelector('.modal-close');
let productTrigger = null;

function openProduct(button) {
  productTrigger = button;
  document.querySelector('#modal-name').textContent = button.dataset.name;
  document.querySelector('#modal-price').textContent = button.dataset.price;
  document.querySelector('#modal-description').textContent = button.dataset.description;
  // Reuse the exact visual, whether it is an SVG mockup or a future photograph.
  modalImage.replaceChildren(button.querySelector('[data-product-image]').cloneNode(true));
  dialog.showModal(); // Native modal: background inertness and keyboard focus containment.
  document.body.classList.add('modal-open');
  closeButton.focus({ preventScroll: true });
}

function closeProduct() {
  if (dialog.open) dialog.close();
}

document.querySelectorAll('.product-button').forEach((button) => {
  // Click handles a single touch, pointer click, Enter and Space without hover dependencies.
  button.addEventListener('click', () => openProduct(button));
});
closeButton.addEventListener('click', closeProduct);
dialog.querySelector('.modal-return').addEventListener('click', closeProduct);
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const lastButton = dialog.querySelector('.modal-return');
  if (event.shiftKey && document.activeElement === closeButton) {
    event.preventDefault();
    lastButton.focus();
  } else if (!event.shiftKey && document.activeElement === lastButton) {
    event.preventDefault();
    closeButton.focus();
  }
});
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProduct();
});

// A drag from the content onto the backdrop must not accidentally close the dialog.
let pointerStartedOnBackdrop = false;
function isBackdrop(event) {
  const rect = dialog.getBoundingClientRect();
  return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
dialog.addEventListener('pointerdown', (event) => {
  pointerStartedOnBackdrop = isBackdrop(event);
});
dialog.addEventListener('click', (event) => {
  if (pointerStartedOnBackdrop && isBackdrop(event)) closeProduct();
  pointerStartedOnBackdrop = false;
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  productTrigger?.focus({ preventScroll: true });
  productTrigger = null;
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealSections = document.querySelectorAll('.reveal');
let observer;

function revealAll() {
  observer?.disconnect();
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal each section only once.
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -45px 0px' });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealAll();
}

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) revealAll();
});

// Enable entry effects only after event handlers and reveal fallbacks are ready.
document.documentElement.classList.add('has-js');

document.querySelector('.collection-link').addEventListener('click', (event) => {
  event.preventDefault();
  const collection = document.querySelector('#collection');
  collection.classList.add('is-visible');
  history.replaceState(null, '', '#collection');
  collection.focus({ preventScroll: true });
  collection.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
