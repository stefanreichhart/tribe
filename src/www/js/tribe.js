Tribe = {
	detect: function(list, callback, defaultItem) {
		if (list && callback) {
			var each = null;
			for (var i = 0; i < list.length; i++) {
				each = list[i];
				if (callback(each, i) === true) {
					return each;
				}
			}
		}
		return defaultItem;
	},
	select: function(list, callback) {
		var results = [];
		if (list && callback) {
			var each = null;
			for (var i = 0; i < list.length; i++) {
				each = list[i];
				if (callback(each, i) === true) {
					results.push(each);
				}
			}
		}
		return results;
	},
	reject: function(list, callback) {
		return Tribe.select(function(each, index) {
			return !callback(each, index);
		});
	},
	deepSelect: function(object, select, collect, maxObjects, unique) {
		return this._deepSelect(object, select, collect, maxObjects || Number.MAX_VALUE, !!unique, [], {});
	},
	_deepSelect: function(object, select, collect, maxObjects, unique, results, uniqueResults) {	
		if (select(object) === true) {
			if (results.length < maxObjects) {
				var collectable = collect(object);
				if (!unique || uniqueResults[collectable] === undefined) {
					results.push(collectable);
					if (unique) {
						uniqueResults[collectable] = true;
					}	
				}
			} else {
				return results;
			}
		} else {
			if (angular.isArray(object)) {
				for (var i = 0; i < object.length; i++) {
					if (results.length < maxObjects) {
						this._deepSelect(object[i], select, collect, maxObjects, unique, results, uniqueResults);
					} else {
						return results;
					}
				}
			} else {
				if (angular.isObject(object)) {
					for (key in object) {
						if (results.length < maxObjects) {
							var value = object[key];
							if (object.hasOwnProperty(key) && select(value, key) === true) {
								var collectable = collect(value, key);
								if (!unique || uniqueResults[collectable] === undefined) {
									results.push(collectable);
									if (unique) {
										uniqueResults[collectable] = true;
									}
								}
							}
							this._deepSelect(value, select, collect, maxObjects, unique, results, uniqueResults);
						} else {
							return results;
						}
					}
				}
			}
		}
		return results;
	},
	unique: function(list) {
		var cache = {};
		var list = list || [];
		var unique = [];
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (cache[item] === undefined) {
				unique.push(item);
				cache[item] = item;
			}
		}
		return unique;
	},
	anySatisfy: function(list, callback) {
		return Tribe.detect(list, function(each, index) {
			return callback(each, index) === true;
		}, undefined) != undefined;
	},
	includes: function(list, object) {
		return this.anySatisfy(list, function(each, index) {
			return each == object;
		});
	},
	incremented: function(string) {
		var matches = ("" + string).match(/^(.+\s)(\d+)$/);
		if (matches && matches.length == 3) {
			return matches[1] + (Number.parseInt(matches[2]) + 1);
		} else {
			return string + " 1";
		}
	},
	initGoogleMaps: function() {
		jQuery(".google-map").each(function(index, each) {
			Tribe.initGoogleMap(jQuery(each));
		});
	},
	initGoogleMap: function(jqElement) {
		//Tribe.googleMap(jqElement, jqElement.data("address"), jqElement.data("editable"));
	},
	lazyInitGoogleMap: function(jqElement) {
		window.setTimeout(function() {
			var jqMapElement = jqElement.parents('li').find('.google-map');
			Tribe.initGoogleMap(jqMapElement);
		}, 500);

	},
	googleMap: function(jqElement, address, editable) {
		var defaults = {
			zoom: 8,
			draggable: editable,
			disableDoubleClickZoom: !editable,
			fullscreenControl: false,
			keyboardShortcuts: false,
			mapTypeControl: false,
			panControl: editable,
			rotateControl: editable,
			scaleControl: editable,
			scrollwheel: editable,
			streetViewControl: false,
			zoomControl: false
		};
		var element = jqElement[0];
		var addressForm = jqElement.parent().parent();
		var scope = addressForm.scope();
		if (google && element && address){
			var geocoder = new google.maps.Geocoder();
			if (address.lat && address.lng) {
				var map = new google.maps.Map(element, jQuery.extend(defaults, {
					zoom: address.zoom || 8,
					center: {
						lat: address.lat,
						lng: address.lng
					}
				}));
				map.addListener("dragend", function() {
					// HACK >>>
					scope.each.zoom = map.getZoom();
					scope.each.lat = map.getCenter().lat();
					scope.each.lng = map.getCenter().lng();
					scope.$apply();
					// <<< HACK
				});
				map.addListener("zoom_changed", function() {
					// HACK >>>
					scope.each.zoom = map.getZoom();
					scope.each.lat = map.getCenter().lat();
					scope.each.lng = map.getCenter().lng();
					scope.$apply();
					// <<< HACK
				});
				var marker = new google.maps.Marker({
					map: map,
					position: {
						lat: address.lat,
						lng: address.lng
					}
				});
				if (!address.zoom) {
					var zoomService = new google.maps.MaxZoomService();
					zoomService.getMaxZoomAtLatLng(address.location, function(result) {
						if (result && result.status === google.maps.GeocoderStatus.OK) {
							var zoom = 0.75 * result.zoom;
							map.setZoom(zoom);
							// HACK >>>
							scope.each.zoom = zoom;
							scope.each.lat = map.getCenter().lat();
							scope.each.lng = map.getCenter().lng();
							scope.$apply();
							// <<< HACK
						}
					});
				}
			} else {
				var text = jQuery([ address.street, address.zip, address.city, address.country ])
					.filter(function(index, each) {
						return each && each.length > 0 && each.replace(/\s+/g, "").length > 0;
					})
					.toArray()
					.join(", ");
				if (text && text.length && text.replace(/\s+/g, "").length) {
					geocoder.geocode({ "address": text }, function(results, status) {
						console.log(results, status);
						if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
							var result = results[0];
							if (result) {
								address.geo = {
									zoom: 8,
									center: result.geometry.location.toJSON()
								};
								var map = new google.maps.Map(element, jQuery.extend(defaults, {
									center: result.geometry.location
								}));
								map.addListener("dragend", function() {
									// HACK >>>
									scope.each.zoom = map.getZoom();
									scope.each.lat = map.getCenter().lat();
									scope.each.lng = map.getCenter().lng();
									scope.$apply();
									// <<< HACK
								});
								map.addListener("zoom_changed", function() {
									// HACK >>>
									scope.each.zoom = map.getZoom();
									scope.each.lat = map.getCenter().lat();
									scope.each.lng = map.getCenter().lng();
									scope.$apply();
									// <<< HACK
								});
								var marker = new google.maps.Marker({
									map: map,
									position: result.geometry.location
								});
								var zoomService = new google.maps.MaxZoomService();
								zoomService.getMaxZoomAtLatLng(result.geometry.location, function(result) {
									if (result && result.status === google.maps.GeocoderStatus.OK) {
										var zoom = 0.75 * result.zoom;
										map.setZoom(zoom);
										// HACK >>>
										scope.each.zoom = zoom;
										scope.each.lat = map.getCenter().lat();
										scope.each.lng = map.getCenter().lng();
										scope.$apply();
										// <<< HACK
									}
								});
							}
						} else {
							alert('Geocode was not successful for the following reason: ' + status);
						}
					});
				}
			}
		}
	}
};