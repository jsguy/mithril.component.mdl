/*	
	This creates google materials design lite mithril components
*/
;(function(){

	var cfgClasses = function(pFix, list, cfg){
		var result = "";
		for(i = 0; i < list.length; i += 1) {
			//	Add class if cfg has it
			result += cfg[list[i]]?
				" " + pFix + list[i]: 
				"";
		}
		return result;
	},
	extend = function () {
		// copy reference to target object
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false,
			options, name, src, copy, clone;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !that.isFunction(target)) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if (length === i) {
			target = this;
			i -= 1;
		}

		for (; i < length; i += 1) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) !== null) {
				// Extend the base object
				for (name in options) {
					if (options.hasOwnProperty(name)) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging object literal values or arrays
						//	TODO: Implement the jQuery functions below...
						if (deep && copy && (that.isPlainObject(copy) || that.isArray(copy))) {
							clone = src && (that.isPlainObject(src) || that.isArray(src)) ? src : that.isArray(copy) ? [] : {};

							// Never move original objects, clone them
							target[name] = that.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	},
	eleConfig = function(el, isInit) {
		if(!isInit) {
			//	Attach JS events for mdl
			if(typeof componentHandler !== "undefined") {
				componentHandler.upgradeElement(el);
			} else {
				if(typeof console !== "undefined"){
					console.error("componentHandler not found - please include google mdl in the page");
				}
			}
		}
	},
	//	These validations could be externalised
	validation = {
		numeric: "-?[0-9]*(\.[0-9]+)?"
	},
	//	Create a standard attributes / config object
	attrsConfig = function(def, attrs){
		attrs = attrs || {};
		attrs.state = attrs.state || {};

		//	Config is init function for MDL JS event
		def.config = eleConfig;

		if(attrs.config) {
			var oldAttrsConfig = attrs.config;
			attrs.config = function(){
				eleConfig.apply(this, arguments);
				oldAttrsConfig.apply(this, arguments);
			}
		}

		var cfg = extend(def, attrs);

		//	Set validation
		if(attrs.state.validate) {
			cfg.pattern = validation[attrs.state.validate]?
				validation[attrs.state.validate]:
				attrs.state.validate;
		}

		cfg = extend(cfg,attrs);
		state = extend({}, cfg).state;
		delete cfg.state;
		return {cfg: cfg, state: state};
	};

	var mithrilMdlComponents = function(m){

		m.components = m.components || {};

		var mButton = {
			//	Modify the attrs here
			//	Note: this will run each time the DOM is 
			//	rendered, so don't do anything destructive
			attrs: function(attrs) {
				attrs = attrs || {};
				attrs.state = attrs.state || {};

				//	Build our class name
				var cName = cfgClasses("mdl-button--", ["raised", "fab", "mini-fab", "icon", "colored", "primary", "accent"], attrs.state) +
					cfgClasses("mdl-js-", ["ripple-effect"], attrs.state);

				return attrsConfig({
					className: "mdl-button mdl-js-button" + cName
				}, attrs);
			},
			//	Always use the attrs, not ctrl, as it isn't returned 
			//	from the default controller.
			view: function(ctrl, attrs) {
				attrs = mButton.attrs(attrs);
			    return m('button', attrs.cfg,
			    	(attrs.state.fab || attrs.state.icon? 
			    		m('i', {className: "material-icons"}, attrs.cfg.text): 
			    		attrs.cfg.text)
			    );
			}
		};

		m.components.mButton = function(args){
			//	Sensible default settings
			return m.component(mButton, extend({
				state: {
					colored: true,
					raised: true,
					"ripple-effect": true
				}
			}, args));
		};


		var mInput = {
			attrs: function(attrs) {
				return attrsConfig({
					className: "mdl-textfield__input",
					type: "text"
				}, attrs);
			},
			view: function(ctrl, attrs) {
				attrs = mInput.attrs(attrs);
				return m('div', {className: "mdl-textfield mdl-js-textfield"}, [
					m('input', attrs.cfg),
					m('label', {className: "mdl-textfield__label", "for": attrs.cfg.id}, attrs.state.label),
					m('span', {className: "mdl-textfield__error"}, attrs.state.error)
				]);
			}
		};

		m.components.mInput = function(args){
			return m.component(mInput, args);
		};


		var mTable = {
			attrs: function(attrs) {
				attrs = attrsConfig({
					className: "mdl-data-table mdl-js-data-table mdl-shadow--2dp"
				}, attrs);

				if(attrs.state.selectable) {
					attrs.cfg.className += " mdl-data-table--selectable";
				}

				return attrs;
			},
			view: function(ctrl, attrs, inner) {
				attrs = mTable.attrs(attrs);
				return m('table', attrs.cfg, inner);
			}
		};

		m.components.mTable = function(args, inner){
			if(!inner){
				//	Inner is the 2nd argument, unless args is an object
				if(Object.prototype.toString.call(args) !== "[object Object]") {
					return m.component(mTable, {}, args);
				} else {
					return m.component(mTable, args);
				}
			} else {
				return m.component(mTable, args, inner);
			}
		};

		var mDialog = {
			attrs: function(attrs) {

				//	Apply polyfill if required
				attrs.config = function(el, isInit) {
					if(!isInit) {
						if(!el.showModal) {
							if(typeof dialogPolyfill !== "undefined") {
								dialogPolyfill.registerDialog(el);
							} else {
								if(typeof console !== "undefined"){
									console.error("dialogPolyfill not found - please include it in the page");
								}
							}
						}
					}
				};

				attrs = attrsConfig({
					className: "mdl-dialog"
				}, attrs);

				return attrs;
			},
			view: function(ctrl, attrs, inner) {
				attrs = mDialog.attrs(attrs);

				return m('dialog', attrs.cfg, [
					(attrs.state.title?
						m('h4', {className: "mdl-dialog__title"}, attrs.state.title):
						""
					),
					m('div', {className: "mdl-dialog__content"}, inner),
					m('div', {className: "mdl-dialog__actions mdl-dialog__actions--full-width"}, [
						//	Configure buttons using attrs.state.actions
						Object.keys(attrs.state.actions).map(function(key) {
							var action = attrs.state.actions[key];
							return m('button', {
								type: "button", 
								className: "mdl-button" + (action.className? " " + action.className: ""), 
								onclick: function(e){
									//	Pass in the dialog element
									action.action(this.parentNode.parentNode, e);
								}
							}, action.text);
						})

					])
				]);
			}
		};

		m.components.mDialog = function(args, inner){
			args = args || {};
			args.state = args.state || {};
			args.state.actions = args.state.actions || {};
			args.state.closeButton = typeof args.state.closeButton !== "undefined"?
				args.state.closeButton:
				true;

			//	Set defaults
			args = extend({
				title: "Dialog"
			}, args);

			if(args.state.closeButton) {
				args.state.actions.close = {
					text: "Close",
					className: "close",
					action: function(dialog){
						dialog.close();
					}
				};
			}

			return m.component(mDialog, args, inner);
		};

		return m.components;
	};

	if (typeof module != "undefined" && module !== null && module.exports) {
		module.exports = mithrilMdlComponents;
	} else if (typeof define === "function" && define.amd) {
		define(function() {
			return mithrilMdlComponents;
		});
	} else {
		mithrilMdlComponents(typeof window != "undefined"? window.m || {}: {});
	}

}());