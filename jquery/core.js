/** Module handler
 * @author Quido Hoekman
 * @version 0.7 (jQuery specific)
 * @class You can create modules and destroy them when you're done, or you can just start/stop them at anytime.
 * The CORE can handle all base DOM functions, so you can switch your base library very easily.
 * @constructor
 * @return public functions are represented here
 */
var CORE = (function () {
	/** @private 
 	* @param moduleData contains all module data
	* @param to_s return anything as a string
 	* @param debug on or off switch for debugging
	*/
    var moduleData = {},
    to_s = function (anything) { return Object.prototype.toString.call(anything); },

    debug = true;

    return {
    	/** Enable or Disable debugging functionality 
    	 * @description this method enables the user to enable debugging functionality for the whole web-application.
    	 * @param on The on or off switch value
    	 */
        debug : function (on) {
            debug  = on ? true : false;
        },
        /** Create modules from DIV's  
         * @description this method gives the user the possibility to make modules based on DIV containers.
         * @param moduleID the id from the div
         * @param creator callback function from the original source
         */
        create_module : function (moduleID, creator) {
            var temp;
            if (typeof moduleID === 'string' && typeof creator === 'function') {
                temp = creator(Sandbox.create(this, moduleID));
                if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                    temp = null;
                    moduleData[moduleID] = {
                        create : creator,
                        instance : null
                    };
                } else {
                    this.log(1, "Module '" + moduleID + "' Registration : FAILED : instance has no init or destory functions");
                }
            } else {
                this.log(1, "Module '" + moduleID + "' Registration : FAILED : one or more arguments are of incorrect type");
            }
        },
        /** Start a single module
         * @description this method allows you to start one module based on their id.
         * @param moduleID the div id from the module.
         */
        start : function (moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                mod.instance = mod.create(Sandbox.create(this, moduleID));
                mod.instance.init();
            }
        },
        /** Start all available modules
         * @description this method allows you to start all available modules 
         */
        start_all : function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.start(moduleID);
                }
            }
        },
        /** Stop a single module
         * @description this method allows you to stop one module based on their id.
         * @param moduleID the div id from the module.
         */
        stop : function (moduleID) {
            var data;
            if (data = moduleData[moduleId] && data.instance) {
                data.instance.destroy();
                data.instance = null;
            } else {
                this.log(1, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
            }
        },
        /** Stop all available modules
         * @description this method allows you to stop all available modules 
         */
        stop_all : function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.stop(moduleID);
                }
            }
        },
        /** Register events inside a module
         * @description this method allows you to register events inside a single module (internal communication).
         * @param evts the events you want to assign
         * @param mod the module you want to assign to.
         */
        registerEvents : function (evts, mod) {
            if (this.isObject(evts) && mod) {
                if (moduleData[mod]) {
                    moduleData[mod].events = evts;
                } else {
                    this.log(1, "");
                }
            } else {
                this.log(1, "");
            }
        },
        /** Trigger event 
         * @description this method allows you to trigger a event. All events are aware of which module they belong too
         * @param evt the event you want to trigger.
         */
        triggerEvent : function (evt) {
            var mod;
            for (mod in moduleData) {
                if (moduleData.hasOwnProperty(mod)){
                    mod = moduleData[mod];
                    if (mod.events && mod.events[evt.type]) {
                        mod.events[evt.type](evt.data);
                    }
                }
            }
        },
        /** Remove events inside a module
         * @description this method allows you to remove events inside a single module.
         * @param evts the events you want to deassign
         * @param mod the module you want to deassign.
         */
        removeEvents : function (evts, mod) {
            if (this.isObject(evts) && mod && (mod = moduleData[mod]) && mod.events) {
                delete mod.events;
            } 
        },
        /** Logging feature based on the debug field
         * @description this method allows you to log everything based on the boolean value from the debug field.
         * @param severity the severity stands for the type of message
         * @param message the message you want to log.
         */
        log : function (severity, message) {
            if (debug) {
                console[ (severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
            }
        },
        /** All available DOM features 
         * 
         */
        dom : {
        	/** Query DOM elements based on the jQuery selector (extendable to Dojo)
        	 * @description this method enables you to search for elements and retrieve them
        	 * @param selector select the elements you want (jQuery style)
        	 * @param context you can say you want jQuery or something else.
        	 * @return Returns the resolved elements
        	 */
            query : function (selector, context) {
                var ret = {}, that = this, jqEls, i = 0;

                if (context && context.find) {
                    jqEls = context.find(selector);
                } else {
                    jqEls = jQuery(selector);
                }
                
                ret = jqEls.get();
                ret.length = jqEls.length;
                ret.query = function (sel) {
                    return that.query(sel, jqEls);
                }
                return ret;
            },
            /** Bind event to element
             * @description this method enables you to assign a event to a specific element.
             * @param element the element you want to assign the event to.
             * @param evt the event you want to assign to the element.
             * @param fn the callback function for the event when triggered
             */
            bind : function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).bind(evt, fn);
                } 
            },
            /** Unbind event to element
             * @description this method enables you to deassign a event from a specific element.
             * @param element the element you want to deassign.
             * @param evt the event you want to deassign.
             * @param fn the function you used for the event.
             */
            unbind : function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).unbind(evt, fn);
                } 
            },
            /** Create element
             * @description this method enables you to create a element based on the given type.
             * @param el the given type 
             * @return Returns the created element
             */
            create: function (el) {
                return document.createElement(el);        
            },
            /** Apply attributes to element
             * @description Apply the given attributes to a specific element.
             * @param el the element to assign the attributes to
             * @param attrs the attributes to assign.
             */
            apply_attrs: function (el, attrs) {
                jQuery(el).attr(attrs);             
            }
        },
        /** Check for Array
         * @description Checks if the given parameter is a Array
         * @param arr the given parameter that should be checked
         * @return Returns true if it is a array else false.
         */
        isArray : function (arr) {
            return jQuery.isArray(arr);         
        },
        /** Check for Object
         * @description Checks if the given parameter is a Object
         * @param obj the given parameter that should be checked
         * @return Returns true if it is a object else false
         */
        isObject : function (obj) {
            return jQuery.isPlainObject(obj);         
        },
        /** Check for Undefined
         * @description Checks if the given parameter is Undefined
         * @param obj the given parameter that should be checked
         * @return Returns true if it is undefined else false
         */
		isUndefined : function(obj) {
			if(obj) {
				return false;
			}
			return true;			
		}
    };

}());
