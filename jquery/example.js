CORE.create_module("example",function(sb) {
	var parent = sb.parent();
	return {
		init : function() {
			console.log('example module loaded');

		},
		destroy : function() {
			//stop
		}
	}
});
CORE.start('example');
