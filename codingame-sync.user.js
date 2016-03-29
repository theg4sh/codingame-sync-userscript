// ==UserScript==
// @name     Codingame File Sync
// @match    *://www.codingame.com/ide/*
// @version  2.0
// @grant    none
// ==/UserScript==

(function() {
  'use strict';

  try {
    var container = null;
    var imagesrc_loading = 'data:image/gif;base64,'+
        'R0lGODlhFQANAOcqAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4O'+
        'Dg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEh'+
        'ISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0'+
        'NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdH'+
        'R0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpa'+
        'WltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1t'+
        'bW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CA'+
        'gIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOT'+
        'k5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaam'+
        'pqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5'+
        'ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zM'+
        'zM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f'+
        '3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy'+
        '8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH/C05FVFNDQVBFMi4wAwEA'+
        'AAAh+QQJCgD/ACwAAAAAFQAIAAAIFwD/CRxIsKDBgwgTKlzIsKHDhxAjPgwIACH5BAkKAP4ALAAA'+
        'AAAVAA0AAAgpAP0J/EewoMGDAhP6O8jQoMKBDRs+nEixosWLGDNq3Mixo8ePIENqDAgAIfkECQoA'+
        '/gAsAAAAABUADQAACC0A/Qn8R7CgwYMCEypcyLDhwYcGG0qcSLFiQogYGWKEqHEjQosgQ4ocSbKk'+
        'wIAAIfkECQoA/gAsAAAAABUADQAACC8A/QkcSLCgwYH/EipcyPCgw4cQI0qUyLDiwokYLWrEyLEj'+
        'Qo0VDYIMWXBkQ4EBAQAh+QQJCgD+ACwAAAUAFQAIAAAIIQD9CRxIsKDBgf8SKlzI8KDDhxAjSpTI'+
        'sOLCiRgtahwYEAAh+QQJCgD+ACwAAAoAFQADAAAIFAD9CRxIsKDBgf8SKlzI8KDDhwEBADs=';
    var getFileLoadBlock = function () {
        try {
            // TODO: - show text "attach..." on _container:hover
            //       - move inline-styles into <style>
            var _container = document.createElement("div");
            _container.className="ide-tab";
            _container.style = "overflow: hidden; max-width: 100px; height: 100%; "+
                "box-sizing: border-box; position: absolute; top:0; bottom:0; left: 115px;";

                var input = document.createElement("input");
                input.className = "ide-tab";
                input.type = "file";
                input.style = "left: 0; height: 100%; opacity: 0; z-index: 100; "+
                    "position: relative; cursor: pointer;";

                _container.appendChild(input);
                _container._input = input;

                var icon = document.createElement("button");
                icon.style = "height: 100%; width: 100%; z-index: 99; top: 0px; color: white; "+
                    "position: absolute; bottom: 0px; text-align: center; vertical-align: baseline; left:0;";

                    var text = document.createElement("span");
                    text.style = "font-size: 14px;";
                    text.innerHTML = "attach...";
                    icon.appendChild(text);

                    var loadImg = document.createElement("img");
                    loadImg.style = "border: 0; width: 0; overflow: hidden;";
                    loadImg.src = imagesrc_loading;
                    icon.appendChild(loadImg);

                _container.appendChild(icon);
                _container._attached = function () {
                    text.innerHTML="";
                    loadImg.style = "border: 0; width: auto;";
                }
        } catch(e) { console.debug(e); }
        return _container;
    }
    var observer = new MutationObserver(function (mutations) {
        var ready = ! (container == null);
        var selector = "div.code-version";
        mutations.forEach(function (mutation) {
            if ( !ready ) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    (function (adn) { // most process in parallel
                        if (adn.nodeType !== 1) { // ELEMENT_NODE
                            return;
                        }
                        var buttons = adn.querySelector(selector);
                        if (!buttons) {
                            return;
                        }

                        try{
                            container = getFileLoadBlock();
                            if (container) {
                                buttons.appendChild(container);
                            }
                        }
                        catch(e) { console.debug(e); }
                    })(mutation.addedNodes[i]);
                }
            } else {
                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    (function (rmn) { // most process in parallel
                        if (rmn.nodeType !== 1) { // ELEMENT_NODE
                            return;
                        }
                        if (!rmn.querySelector(selector)) {
                            return;
                        }
                        container = null;
                    })(mutation.removedNodes[i]);
                }
            }
        });
    });
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false
    });

    var reader = new FileReader();
    reader.onload = function (event) {
        window.document.dispatchEvent(new CustomEvent("ExternalEditorToIDE", {
            detail: {
                status: "updateCode",
                code: event.target.result.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
            }
        }));
    };
    var sync = setInterval(function () {
        if (container && container._input.files.length === 1) {
            try {
                reader.readAsText(container._input.files[0]);
                container._attached();
            }
            catch (e) { /* Safely ignore any error */ console.debug(e); }
        }
    }, 1000);
  } catch(e) { console.debug(e); }
})();
