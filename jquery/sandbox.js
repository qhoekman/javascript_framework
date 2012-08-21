/** The sandbox that contains all functionality for the modules
 * @author Quido Hoekman
 * @version 0.4 (jQuery specific)
 * @class The sandbox is a container that holds all functionality for the assigned modules.
 */
var Sandbox =  {
	/** Create a module
	 * @description Create a module if the div is available, and give them the sandbox functionality
	 * @param core the module handler for all basic needs
	 * @param module_selector the name of the div
	 * @return Returns the functions for the modules
	 */
    create : function (core, module_selector) {
        var CONTAINER = core.dom.query('#' + module_selector);
        return {
        	/** Find the element
        	 * @description Find the element based on the given selector
        	 * @param selector The selector specifies which element to search for
        	 * @return Returns the found element 
        	 */
            find : function (selector) {
                return CONTAINER.query(selector);
            },
            /** Add a event
             * @description Add a event to a specified element with a function callback.
             * @param element The element to assign the event to.
             * @param type The type of event to assign.
             * @param fn the callback function when triggered.
             */
            addEvent : function (element, type, fn) {
                core.dom.bind(element, type, fn);           
            },
            /** Remove a event
             * @description Remove a event from a specified element with a function callback.
             * @param element The element to deassign.
             * @param type The type of event to deassign.
             * @param fn the callback function when was assigned.
             */
            removeEvent : function (element, type, fn) {
                core.dom.unbind(element, type, fn);              
            },
            /** Return a element that was dragged
             * @description Returns a element that was dragged to the original place
             * @param e the original event
             */
            dragReturn : function(e) {
				if($(e.target).hasClass('ui-inplace') == true) {
					$(e.target).removeClass('ui-inplace');
				} else { 
					$(e.target).animate({
						'top' : 0,
						'left' : 0
					})						
				}
            },
            /** Speak to other modules
             * @description This method enables you to speak to other modules
             * @param evt The event to send
             */
            notify : function (evt) {
                if (core.isObject(evt) && evt.type) {
                    core.triggerEvent(evt);
                }         
            },
            /** Add a CSS class
             * @description This method enables you to add a CSS Class to a specified element.
             * @param elem The element to add the class to
             * @param cls The CSS class to add
             */
			addClass :  function(elem,cls) {
		  		 if (!this.hasClass(elem, cls)) 		   { 
	   				elem.className += (elem.className ? ' ' : '') +cls; 
	   			 }
			},
            /** Check it has the CSS Class
             * @description This method enables you check the specified element has the CSS Class.
             * @param elem The element that has the CSS Class
             * @param cls The CSS class 
             * @return Returns true if the element has the CSS Class else false
             */
			hasClass : function(elem,cls) {
				return new RegExp('(\\s|^)'+cls+'(\\s|$)').test(elem.className);
			},
            /** Remove a CSS class
             * @description This method enables you to remove a CSS Class from a specified element.
             * @param elem The element
             * @param cls The CSS class to remove
             */
			removeClass : function(elem,cls) {
			    if (this.hasClass(elem, cls)) {
	      			elem.className=elem.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
	   			}
			},
			/** Listen to specific events
			 * @description This method enables you to listen to specific events for internal module communication.
			 * @param evts The events to listen to
			 */
            listen : function (evts) {
                if (core.isObject(evts)) {
                    core.registerEvents(evts, module_selector);
                }
            },
            /** Ignore modules that are speaking
             * @description  Ignore events taking place when ask for it.
             * @param evts The events that shouldn't be triggered
             */
            ignore : function (evts) {
                if (core.isArray) {
                    core.removeEvents(evts, module_selector);
                }   
            },
            /** Return the module
             * @description Return the module element
             * @return Returns the parent of the module 
             */
			parent : function() {
				return CONTAINER[0];
			},
			/** Return a array without the doubles
			 * @description Returns the doubles from a array 
			 * @param arr The array that should be filtered
			 * @return Returns the doubles from a array.
			 */
			arrayReturnDoubles : function(arr) {
				var sortedArray = arr.sort(); 
				var resultsArray = [];
				for (var i = 0; i < arr.length - 1; i++) {
				    if (sortedArray[i + 1] == sortedArray[i]) {
				        resultsArray.push(sortedArray[i]);
				    }
				}
				return resultsArray();				
			},
			/** Open a XHR connection
			 * @description Return a XHR connection for AJAX communication
			 * @param mode The mode can be GET or POST
			 * @param href The URL to send or get it from
			 * @return Returns the XHR connection that is setupped.
			 */
			openConnection : function (mode,href) {
				if(href) {	
					if(mode == 'post' || mode == 'get') {
						if (window.XMLHttpRequest)			  {
							xhr=new XMLHttpRequest();
						}	else	 {
							xhr=new ActiveXObject("Microsoft.XMLHTTP");
						}
						xhr.open(mode,href);
						return xhr;
					}			
				}
			},
			/** Create a Element
			 * @description create a element with a given attributes object.
			 * @param el The element type to create.
			 * @param config The attribute list to apply to the element.
			 * @return Returns the created element with the given config.
			 */
            createElement : function (el, config) {
                var i, child, text;
                el = core.dom.create(el);
                
                if (config) {
                    if (config.children && core.isArray(config.children)) {
                        i = 0;
                        while(child = config.children[i]) {
                            el.appendChild(child);
                            i++;
                        }
                        delete config.children;
                    }
                    if (config.text) {
                        el.appendChild(document.createTextNode(config.text));
                        delete config.text;
                    }
                    core.dom.apply_attrs(el, config);
                }
                return el;
            }
        };
    }
}
