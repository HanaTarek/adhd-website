/**
 * setupTests.js
 * ─────────────────────────────────────────────────────────────
 * Place this file at: src/setupTests.js
 *
 * Extends Jest/Vitest with @testing-library/jest-dom matchers so
 * you can use assertions like:
 *   expect(element).toBeInTheDocument()
 *   expect(element).toHaveClass('active')
 *   expect(button).toBeDisabled()
 */

import '@testing-library/jest-dom'

class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}

global.IntersectionObserver = IntersectionObserverMock;