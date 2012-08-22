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
	example : 1
}
function loadModules() {
	for (var MODULE in MODULES) {
		if(MODULES[MODULE] != 0 && document.getElementById(MODULE)) {
			el = document.createElement('script');
			el.setAttribute('src',BASEPATH+MODULE+'.js');
			document.body.appendChild(el);
		}
	}
}
window.onload = function() {
	loadModules();
}
