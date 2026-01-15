// ==UserScript==
// @name         Highlight Elements with "data-cnstrc-" Attributes
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Highlights elements containing attributes that start with "data-cnstrc-" with a small hex toggle button
// @author       CouldBeYou
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    let highlightingEnabled = GM_getValue("highlightingEnabled", true);
    let redrawTimeout;
    let labelPositions = []; // Store label positions to avoid overlap

    const specialTags = ["data-cnstrc-search", "data-cnstrc-num-results", "data-cnstrc-browse", "data-cnstrc-filter-name","data-cnstrc-filter-value"]; // Tags that force label above

    function highlightElements() {
        if (!highlightingEnabled) return;

        // Clear existing highlights
        document.querySelectorAll(".highlight-box, .highlight-label").forEach(el => el.remove());
        labelPositions = []; // Reset label position tracking

        const elements = document.querySelectorAll('*');

        elements.forEach(el => {
            let matchingAttributes = [];

            for (let attr of el.attributes) {
                if (attr.name.startsWith("data-cnstrc-")) {
                    matchingAttributes.push(`${attr.name}${attr.value ? `='${attr.value}'` : ''}`);
                }
            }

            if (matchingAttributes.length > 0) {
                drawBoundingBox(el, matchingAttributes);
            }
        });
    }

    function drawBoundingBox(element, labels) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Create the bounding box
        const box = document.createElement("div");
        box.classList.add("highlight-box");
        box.style.position = "absolute";
        box.style.border = "2px solid red";
        box.style.background = "rgba(255, 0, 0, 0.3)";
        box.style.left = `${window.scrollX + rect.left}px`;
        box.style.top = `${window.scrollY + rect.top}px`;
        box.style.width = `${rect.width}px`;
        box.style.height = `${rect.height}px`;
        box.style.pointerEvents = "none";
        box.style.zIndex = "9999";

        // Create the label
        const label = document.createElement("div");
        label.classList.add("highlight-label");
        label.innerText = labels.join("\n");
        label.style.position = "absolute";
        label.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        label.style.color = "black";
        label.style.fontSize = "12px";
        label.style.padding = "4px 6px";
        label.style.border = "1px solid black";
        label.style.whiteSpace = "pre-line";
        label.style.borderRadius = "4px";
        label.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.3)";
        label.style.zIndex = "10000";
        label.style.maxWidth = `${rect.width}px`;

        // Estimate text height
        const textHeight = labels.length * 16; // Approx 16px per line

        // Check if any of the labels match the special tags
        const forceAbove = labels.some(label => specialTags.some(tag => label.startsWith(tag)));

        if (forceAbove) {
            // Place text above the box
            label.style.left = `${window.scrollX + rect.left}px`;
            label.style.top = `${window.scrollY + rect.top - textHeight - 24}px`; // 24px spacing
        } else if (rect.width > 60 && rect.height > textHeight + 10) {
            // If box is big enough, put text inside
            label.style.left = `${window.scrollX + rect.left + 5}px`;
            label.style.top = `${window.scrollY + rect.top + 5}px`;
        } else {
            // If the box is too small, put text below
            let newTop = rect.bottom + 5;
            let newLeft = rect.left;

            // Ensure labels don't overlap
            while (labelPositions.some(pos => Math.abs(pos.top - newTop) < textHeight)) {
                newTop += textHeight + 5; // Push down to avoid overlap
            }

            label.style.left = `${window.scrollX + newLeft}px`;
            label.style.top = `${window.scrollY + newTop}px`;

            // Save position to prevent overlap
            labelPositions.push({ top: newTop, height: textHeight });
        }

        document.body.appendChild(box);
        document.body.appendChild(label);
    }

    function toggleHighlighting() {
        highlightingEnabled = !highlightingEnabled;
        GM_setValue("highlightingEnabled", highlightingEnabled);

        document.querySelectorAll(".highlight-box, .highlight-label").forEach(el => el.remove());
        if (highlightingEnabled) highlightElements();

        updateButtonStyle();
    }

    function createHexButton() {
        const button = document.createElement("div");
        button.id = "highlight-toggle-button";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.width = "20px"; // Smaller size
        button.style.height = "20px"; // Smaller size
        button.style.clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"; // Hexagon shape
        button.style.background = highlightingEnabled ? "#ff0000" : "#555"; // Red when ON, Gray when OFF
        button.style.border = "2px solid black"; // Black outline
        button.style.cursor = "pointer";
        button.style.zIndex = "10000";
        button.style.transition = "background 0.2s ease-in-out";

        button.addEventListener("click", toggleHighlighting);
        document.body.appendChild(button);
    }

    function updateButtonStyle() {
        const button = document.getElementById("highlight-toggle-button");
        if (button) {
            button.style.background = highlightingEnabled ? "#ff0000" : "#555";
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            clearTimeout(redrawTimeout);
            redrawTimeout = setTimeout(highlightElements, 500);
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    function setupEventListeners() {
        const events = ["DOMContentLoaded", "load", "popstate", "hashchange", "click", "keydown", "scroll"];
        events.forEach(event =>
            window.addEventListener(event, () => {
                clearTimeout(redrawTimeout);
                redrawTimeout = setTimeout(highlightElements, 500);
            })
        );
    }

    GM_registerMenuCommand("Toggle Highlighting", toggleHighlighting);

    setupEventListeners();
    observeDOMChanges();
    highlightElements();
    createHexButton();
})();
