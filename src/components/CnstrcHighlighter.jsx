import React, { useState, useEffect, useCallback, useRef } from 'react';

const SPECIAL_TAGS = [
  'data-cnstrc-search',
  'data-cnstrc-num-results',
  'data-cnstrc-browse',
  'data-cnstrc-filter-name',
  'data-cnstrc-filter-value',
];

function CnstrcHighlighter() {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem('cnstrc-highlighter-enabled');
    return stored === null ? false : stored === 'true';
  });
  const redrawTimeoutRef = useRef(null);
  const labelPositionsRef = useRef([]);

  const clearHighlights = useCallback(() => {
    document.querySelectorAll('.cnstrc-highlight-box, .cnstrc-highlight-label').forEach((el) => el.remove());
    labelPositionsRef.current = [];
  }, []);

  const drawBoundingBox = useCallback((element, labels) => {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Create the bounding box
    const box = document.createElement('div');
    box.classList.add('cnstrc-highlight-box');
    box.style.cssText = `
      position: absolute;
      border: 2px solid red;
      background: rgba(255, 0, 0, 0.3);
      left: ${window.scrollX + rect.left}px;
      top: ${window.scrollY + rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      z-index: 9999;
    `;

    // Create the label
    const label = document.createElement('div');
    label.classList.add('cnstrc-highlight-label');
    label.innerText = labels.join('\n');
    label.style.cssText = `
      position: absolute;
      background-color: rgba(255, 255, 255, 0.95);
      color: black;
      font-size: 11px;
      font-family: monospace;
      padding: 4px 6px;
      border: 1px solid black;
      white-space: pre-line;
      border-radius: 4px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: ${rect.width}px;
    `;

    const textHeight = labels.length * 16;
    const forceAbove = labels.some((l) => SPECIAL_TAGS.some((tag) => l.startsWith(tag)));

    if (forceAbove) {
      label.style.left = `${window.scrollX + rect.left}px`;
      label.style.top = `${window.scrollY + rect.top - textHeight - 24}px`;
    } else if (rect.width > 60 && rect.height > textHeight + 10) {
      label.style.left = `${window.scrollX + rect.left + 5}px`;
      label.style.top = `${window.scrollY + rect.top + 5}px`;
    } else {
      let newTop = rect.bottom + 5;
      const newLeft = rect.left;

      while (labelPositionsRef.current.some((pos) => Math.abs(pos.top - newTop) < textHeight)) {
        newTop += textHeight + 5;
      }

      label.style.left = `${window.scrollX + newLeft}px`;
      label.style.top = `${window.scrollY + newTop}px`;

      labelPositionsRef.current.push({ top: newTop, height: textHeight });
    }

    document.body.appendChild(box);
    document.body.appendChild(label);
  }, []);

  const highlightElements = useCallback(() => {
    clearHighlights();

    document.querySelectorAll('*').forEach((el) => {
      const matchingAttributes = [];

      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-cnstrc-')) {
          matchingAttributes.push(`${attr.name}${attr.value ? `='${attr.value}'` : ''}`);
        }
      }

      if (matchingAttributes.length > 0) {
        drawBoundingBox(el, matchingAttributes);
      }
    });
  }, [clearHighlights, drawBoundingBox]);

  const scheduleRedraw = useCallback(() => {
    if (!enabled) return;
    clearTimeout(redrawTimeoutRef.current);
    redrawTimeoutRef.current = setTimeout(highlightElements, 300);
  }, [enabled, highlightElements]);

  // Toggle handler
  const handleToggle = useCallback(() => {
    setEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('cnstrc-highlighter-enabled', String(newValue));
      return newValue;
    });
  }, []);

  // Apply/clear highlights when enabled changes
  useEffect(() => {
    if (enabled) {
      highlightElements();
    } else {
      clearHighlights();
    }
  }, [enabled, highlightElements, clearHighlights]);

  // MutationObserver for DOM changes
  useEffect(() => {
    if (!enabled) return undefined;

    const observer = new MutationObserver(() => {
      scheduleRedraw();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [enabled, scheduleRedraw]);

  // Event listeners for scroll and resize
  useEffect(() => {
    if (!enabled) return undefined;

    const handleEvent = () => scheduleRedraw();

    window.addEventListener('scroll', handleEvent);
    window.addEventListener('resize', handleEvent);

    return () => {
      window.removeEventListener('scroll', handleEvent);
      window.removeEventListener('resize', handleEvent);
    };
  }, [enabled, scheduleRedraw]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearHighlights();
    clearTimeout(redrawTimeoutRef.current);
  }, [clearHighlights]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={enabled ? 'Hide data-cnstrc-* highlights' : 'Show data-cnstrc-* highlights'}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '24px',
        height: '24px',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: enabled ? '#ff0000' : '#555',
        border: '2px solid black',
        cursor: 'pointer',
        zIndex: 10001,
        transition: 'background 0.2s ease-in-out',
        padding: 0,
      }}
      aria-label={enabled ? 'Disable Constructor highlighting' : 'Enable Constructor highlighting'}
    />
  );
}

export default CnstrcHighlighter;
