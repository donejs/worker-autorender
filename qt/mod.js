define(["can/view/stache/stache","test/basics/state"], function(stache){

	var __export = {
		render: stache([{"tokenType":"start","args":["html",false]},{"tokenType":"end","args":["html",false]},{"tokenType":"chars","args":["\n\t"]},{"tokenType":"start","args":["head",false]},{"tokenType":"end","args":["head",false]},{"tokenType":"chars","args":["\n\t\t"]},{"tokenType":"start","args":["title",false]},{"tokenType":"end","args":["title",false]},{"tokenType":"chars","args":["Hello page"]},{"tokenType":"close","args":["title"]},{"tokenType":"chars","args":["\n\t"]},{"tokenType":"close","args":["head"]},{"tokenType":"chars","args":["\n\t"]},{"tokenType":"start","args":["body",false]},{"tokenType":"end","args":["body",false]},{"tokenType":"chars","args":["\n\t\t"]},{"tokenType":"start","args":["can-import",true]},{"tokenType":"attrStart","args":["from"]},{"tokenType":"attrValue","args":["test/basics/state"]},{"tokenType":"attrEnd","args":["from"]},{"tokenType":"attrStart","args":["[.]"]},{"tokenType":"attrValue","args":["{value}"]},{"tokenType":"attrEnd","args":["[.]"]},{"tokenType":"end","args":["can-import",true]},{"tokenType":"chars","args":["\n\n\t\t"]},{"tokenType":"start","args":["span",false]},{"tokenType":"attrStart","args":["id"]},{"tokenType":"attrValue","args":["hello"]},{"tokenType":"attrEnd","args":["id"]},{"tokenType":"end","args":["span",false]},{"tokenType":"chars","args":["Hello "]},{"tokenType":"special","args":["hello"]},{"tokenType":"chars","args":["!"]},{"tokenType":"close","args":["span"]},{"tokenType":"chars","args":["\n\t\t"]},{"tokenType":"start","args":["script",false]},{"tokenType":"attrStart","args":["src"]},{"tokenType":"attrValue","args":["../../node_modules/steal/steal.js"]},{"tokenType":"attrEnd","args":["src"]},{"tokenType":"end","args":["script",false]},{"tokenType":"chars","args":[""]},{"tokenType":"close","args":["script"]},{"tokenType":"chars","args":["\n\t"]},{"tokenType":"close","args":["body"]},{"tokenType":"chars","args":["\n"]},{"tokenType":"close","args":["html"]},{"tokenType":"chars","args":["\n"]},{"tokenType":"done","args":[]}]),
		start: function(){
			var state = this.state = new this.viewModel;
			can.route.map(state);
			can.route.ready();
			this.rerender();
		},
		rerender: function(){
			var keep = { "SCRIPT": true, "STYLE": true, "LINK": true };
			function eachChild(parent, callback){
				can.each(can.makeArray(parent.childNodes), function(el){
					if(!keep[el.nodeName]) {
						callback(el);
					}
				});
			}

			function remove(el) {
				can.remove(el);
			}

			function appendTo(parent){
				return function(el){
					can.appendChild(parent, el);
				}
			}

			this.renderAsync().then(function(result){
				var frag = result.fragment;
				var head = document.head;
				var body = document.body;

				// Move elements from the fragment's head to the document head.
				eachChild(head, remove);
				eachChild(can.$("head", frag)[0], appendTo(head));

				// Move elements from the fragment's body to the document body.
				eachChild(body, remove);
				eachChild(can.$("body", frag)[0], appendTo(body));
			});
		},
		renderAsync: function(renderer, data, options, doc){
			renderer = renderer || this.render;
			data = data || this.state;
			options = options || {};

			var frag = renderer(data, options);

			function waitForPromises(){
				var readyPromises = [];
				if(data.__readyPromises) {
					readyPromises = data.__readyPromises;
					data.__readyPromises = [];
				}

				if(readyPromises.length === 0) {
					if(doc) {
						var oldDoc = can.document;
						can.document = doc;
						can.appendChild(doc.body, frag, doc);
						can.document = oldDoc;
					}

					return new can.Deferred().resolve();
				}

				return can.when.apply(can, readyPromises).then(waitForPromises);
			}

			return waitForPromises().then(function(){
				return {
					fragment: frag,
					data: data.__pageData
				};
			});
		},

	};
	var __isNW = (function(){
		try{var nr = System._nodeRequire; return nr && nr('nw.gui') !== 'undefined';}catch(e){return false;}
	})();

	return __export;
});
