define([
	"@loader",
	"done-autorender/parse",
	"module",
	"./module_template",
	"./window_template",
	"./worker_template"
], function(loader, parse, module, moduleTemplate, windowTemplate, workerTemplate){

	var isWorker = typeof WorkerGlobalScope !== "undefined" &&
		(self instanceof WorkerGlobalScope);
	var isNode = typeof process === "object" &&
		{}.toString.call(process) === "[object process]";

	function translate(load){
		var result = parse(load.source);

		var waitFor = Promise.resolve();

		// This is the base name that we will use to build the dependant
		// modules. This would be: app/index.stache
		var baseModuleName = load.metadata.pluginArgument;

		// This is the base module, the literal translation of the template
		// and the same as translated by done-autorender. Named as:
		// app/index.stache/module
		var moduleModuleName = baseModuleName + "/module";

		var moduleSource = moduleTemplate({
			imports: JSON.stringify(result.imports),
			args: result.args.join(", "),
			intermediate: JSON.stringify(result.intermediate),
			ases: can.map(result.ases, function(from, name){
				return "\t" + name + ": " + name +"['default'] || " + name;
			}).join(",\n")
		});

		waitFor = loader.define(moduleModuleName, moduleSource);

		var workerModuleName = baseModuleName + "/worker";

		var workerSource = workerTemplate({
			main: moduleModuleName
		});

		if(isWorker) {
			debugger;
			return waitFor.then(function(){
				return workerSource;
			});
		}

		if(isNode) {
			waitFor = waitFor.then(function(){
				return loader.define(workerModuleName, workerSource);
			});
		}

		// This is the module that handles the window side. It serves
		// as the base moduleName because the moduleModuleName will
		// be dynamically imported. -> app/index.stache
		var windowSource = windowTemplate({
			main: moduleModuleName,
			workerMain: load.name
		});

		return waitFor.then(function(){
			return windowSource;
		});
	}

	return {
		translate: translate
	};

});
