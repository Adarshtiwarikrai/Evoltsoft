// frontend/src/directives/intersect.js
const observers = new WeakMap();

const initObserver = (el, binding) => {
  const options = binding.value || {};
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (typeof binding.arg === 'function') {
          binding.arg(el, true); // Pass element and intersecting state
        } else {
          el.classList.add(binding.arg || 'in-view'); // Default class
        }
        if (options.once !== false) { // Disconnect after first intersection by default
          observer.unobserve(el);
          observers.delete(el);
        }
      } else {
        if (options.once === false) { // Only if not 'once'
          if (typeof binding.arg === 'function') {
            binding.arg(el, false);
          } else {
            el.classList.remove(binding.arg || 'in-view');
          }
        }
      }
    });
  }, {
    threshold: options.threshold || 0.1, // Trigger when 10% of element is visible
    ...options
  });

  observer.observe(el);
  observers.set(el, observer);
};

export default {
  mounted(el, binding) {
    initObserver(el, binding);
  },
  updated(el, binding) {
    // If options change, re-initialize (optional, can be complex)
    // For simplicity, we'll assume options don't change dynamically often.
    // If they do, clean up old observer first.
    const oldObserver = observers.get(el);
    if (oldObserver) {
      oldObserver.unobserve(el);
      observers.delete(el);
    }
    initObserver(el, binding);
  },
  beforeUnmount(el) {
    const observer = observers.get(el);
    if (observer) {
      observer.unobserve(el);
      observers.delete(el);
    }
  }
};