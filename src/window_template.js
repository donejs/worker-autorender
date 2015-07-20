define([], function(){
	return function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += 'define([\n	"@loader",\n	"worker-render/window"\n], function(loader, windowWorker){\n\n	var supportsWorkers = typeof Worker !== "undefined";\n\n	if(supportsWorkers){\n		var worker = new Worker(loader.stealURL+"?main=' +
((__t = ( workerMain )) == null ? '' : __t) +
'");\n		windowWorker.updateWith(worker);\n	} else {\n		loader.import("' +
((__t = ( main )) == null ? '' : __t) +
'").then(function(app){\n			app.start();\n		});\n	}\n\n});\n';

}
return __p
}
});