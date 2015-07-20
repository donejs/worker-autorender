define([], function(){
	return function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += 'define([\n	"worker-render/worker",\n	"' +
((__t = ( main )) == null ? '' : __t) +
'"\n], function(workerRender, app){\n\n	workerRender.ready(function(){\n		app.start();\n	});\n\n});\n';

}
return __p
}
});