var template = require("lodash.template");
var fs = require("fs");

var templates = [
	{ src: "window_template.txt", dest: "window_template.js" },
	{ src: "autorender_template.txt", dest: "autorender_template.js" },
	{ src: "worker_template.txt", dest: "worker_template.js" }
];

templates.forEach(function(tmpl){
	var str = fs.readFileSync(__dirname + "/src/" + tmpl.src);

	var fn = template(str);

	var out = "def" + "ine([], function(){\n" +
		"\treturn " + fn.source +
		"\n});";

	fs.writeFileSync(__dirname + "/src/" + tmpl.dest, out, "utf8");
});
