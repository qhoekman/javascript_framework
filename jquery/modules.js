/** Module loader
 * This file contains all modules, that are going to be loaded.
 * @author Quido Hoekman
 * @version 0.1
 * @param BASEPATH has the current directory of the file
 * @param MODULES contains all modules with 1's and 0's as boolean values
 * 
 */
var BASEPATH = "";
var MODULES = {
	system : 0,
	header : 0,
	footer : 0,
	filters : 0,
	control_panel : 0,
	timeline : 1,
	semester : 1
}
function loadModules() {
	for (var MODULE in MODULES) {
		if(MODULES[MODULE] != 0 && document.getElementById(MODULE)) {
			el = document.createElement('script');
			el.setAttribute('src',BASEPATH+MODULE+'.js');
			document.head.appendChild(el);
		}
	}
}
window.onload = function() {
	loadModules();
}
