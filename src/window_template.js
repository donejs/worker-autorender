define([], function(){
	return function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += 'define([\n	"@loader",\n	"worker-render/window"\n], function(loader, windowWorker){\n\n	var supportsWorkers = typeof Worker !== "undefined";\n	var isNode = typeof process === "object" &&\n		{}.toString.call(process) === "[object process]";\n\n	// A promise for when we have imported the "real" autorender.\n	// This is so that server-side rendering can wait for it.\n	var importPromise;\n\n	if(supportsWorkers){\n		var worker = new Worker(loader.stealURL+"?main=' +
((__t = ( workerMain )) == null ? '' : __t) +
'");\n		windowWorker.updateWith(worker);\n	} else {\n		importPromise = loader.import("' +
((__t = ( main )) == null ? '' : __t) +
'");\n\n		if(!isNode) {\n			importPromise.then(function(app){\n				app.start();\n			});\n		}\n	}\n\n	return {\n		importPromise: importPromise\n	};\n\n});\n';

}
return __p
}
});