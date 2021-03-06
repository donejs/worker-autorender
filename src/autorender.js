define([
	"@loader",
	"done-autorender/parse",
	"module",
	"./autorender_template",
	"./window_template",
	"./worker_template"
], function(loader, parse, module, autorenderTemplate, windowTemplate, workerTemplate){

	var isWorker = typeof WorkerGlobalScope !== "undefined" &&
		(self instanceof WorkerGlobalScope);
	var isNode = typeof process === "object" &&
		{}.toString.call(process) === "[object process]";
	var isBuilding = isNode && typeof SystemRegistry !== "undefined";
	var localLoader = loader.localLoader || loader;

	function addresser(loadAddress){
		return function(part, plugin){
			var base = loadAddress + "." + part;
			return base + (plugin ? ("." + plugin) : "");
		};
	}

	function setBundle(name){
		var bundle = localLoader.bundle = localLoader.bundle || [];
		if(bundle.indexOf(name) === -1) {
			bundle.unshift(name);
		}
		var virtualModules = localLoader.virtualModules = localLoader.virtualModules || {};
			virtualModules[name] = source;
	}

	function translate(load){
		var result = parse(load.source);

		// This is the base name that we will use to build the dependant
		// modules. This would be: app/index
		var baseModuleName = load.metadata.pluginArgument;
		baseModuleName = baseModuleName.substr(0, baseModuleName.lastIndexOf("."));

		// A function used to create addresses for these pseudo-modules.
		var address = addresser(load.address);

		// This is the base module, the literal translation of the template
		// and the same as translated by done-autorender. Named as:
		// app/index.stache/module
		var autorenderModuleName = baseModuleName + "_autorender";

		var autorenderSource = autorenderTemplate({
			imports: JSON.stringify(result.imports),
			args: result.args.join(", "),
			intermediate: JSON.stringify(result.intermediate),
			ases: can.map(result.ases, function(from, name){
				return "\t" + name + ": " + name +"['default'] || " + name;
			}).join(",\n")
		});

		// The worker module
		var workerModuleName = baseModuleName + "_worker";

		var workerSource = workerTemplate({
			main: autorenderModuleName
		});

		// This is the module that handles the window side. It serves
		// as the base moduleName because the autorenderModuleName will
		// be dynamically imported. -> app/index.stache
		var windowSource = windowTemplate({
			main: load.name,
			autorenderName: autorenderModuleName,
			workerName: workerModuleName
		});

		function defineAutorender(){
			localLoader.define(autorenderModuleName, autorenderSource, {
				address: address("autorender")
			});
		}

		function defineWorker(){
			localLoader.define(workerModuleName, workerSource, {
				address: address("worker")
			});
		}

		// There are 4 environments we care about (and what they need):
		// Browser Window -> autorender, window, worker -> window
		// Browser Worker -> autorender, worker -> worker
		// Node -> autorender, window -> window
		// Build -> autorender, window, worker -> window

		// If we are building we need to set the worker and autorender
		// as bundles and return the window as the main.
		if(isBuilding) {
			// Set the bundle names
			// we will create an autorender bundle and a worker bundle
			setBundle(autorenderModuleName);
			setBundle(workerModuleName);

			return windowSource;
		}

		// If we are in Node (dev) we need to define autorender
		// and return the window as main.
		else if(isNode) {
			defineAutorender();

			return windowSource;
		}

		// If we are in a worker we need to define autorender
		// and return the worker as main.
		else if(isWorker) {
			defineAutorender();

			return workerSource;
		}

		// Otherwise we should be a browser window where we'll define
		// autorender and worker and return the window as main.
		else {
			defineAutorender();

			return windowSource;
		}
	}

	return {
		translate: translate
	};

});
