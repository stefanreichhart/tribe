describe("Tribe.js", function() {

	var items = [ "Elit", "Aenean", "Parturient", "Fusce", "Sollicitudin", "Porta", "Pharetra", "Malesuada", "Inceptos" ];

	it("anySatisfy", function() {
		expect(Tribe.anySatisfy(items, function(each, index) {
			return each == "Aenean";
		})).toBe(true);
		expect(Tribe.anySatisfy(items, function(each, index) {
			return each == "aenean";
		})).toBe(false);
		expect(Tribe.anySatisfy(items, function(each, index) {
			return each == "Nullam";
		})).toBe(false);
	});

	it("detect", function() {
		expect(Tribe.detect(items, function(each, index) {
			return each == "Aenean";
		})).toBe("Aenean");
		expect(Tribe.detect(items, function(each, index) {
			return each == "Nullam";
		})).toBeUndefined();
		expect(Tribe.detect(items, function(each, index) {
			return each == "Nullam";
		}, null)).toBeNull();
		expect(Tribe.detect(items, function(each, index) {
			return each == "Nullam";
		}, "Mollis")).toBe("Mollis");
	});

	it("select", function() {
		expect(Tribe.select(items, function(each, index) {
			return each.length > 6;
		})).toEqual([ "Parturient", "Sollicitudin", "Pharetra", "Malesuada", "Inceptos" ]);
		expect(Tribe.select(items, function(each, index) {
			return each == "Nullam";
		})).toEqual([]);
		expect(Tribe.select(items, function(each, index) {
			return each == "Fusce";
		})).toEqual([ "Fusce" ]);
	});

	it("reject", function() {
		expect(Tribe.reject(items, function(each, index) {
			return each.length > 6;
		})).toEqual([ "Elit", "Aenean", "Fusce", "Porta" ]);
		expect(Tribe.reject(items, function(each, index) {
			return each != "Nullam";
		})).toEqual([]);
		expect(Tribe.reject(items, function(each, index) {
			return each != "Fusce";
		})).toEqual([ "Fusce" ]);
	});

	it("unique", function() {
		expect(Tribe.unique(items)).toEqual(items);
		var moreItems = [].concat(items).concat(items).concat(items);
		expect(moreItems.length > items.length).toBe(true);
		expect(Tribe.unique(moreItems)).toEqual(items);
		expect(Tribe.unique(Tribe.unique(moreItems))).toEqual(items);
		expect(Tribe.unique(Tribe.unique(Tribe.unique(moreItems)))).toEqual(items);
	});

	it("includes", function() {
		expect(Tribe.includes(items, "Fusce")).toBe(true);
		angular.forEach(items, function(each, index) {
			expect(Tribe.includes(items, each)).toBe(true);
		});
		expect(Tribe.includes(items, "fusce")).toBe(false);
		expect(Tribe.includes(items, " Fusce")).toBe(false);
		expect(Tribe.includes(items, "Fusce ")).toBe(false);
	});

	it("incremeted", function() {
		expect(Tribe.incremented("Nullam")).toEqual("Nullam (1)");
		expect(Tribe.incremented("Nullam 1")).toEqual("Nullam 1 (1)");
		expect(Tribe.incremented("Nullam (1)")).toEqual("Nullam (2)");
		expect(Tribe.incremented("Nullam (999)")).toEqual("Nullam (1000)");
		expect(Tribe.incremented("Nullam 1 Nullam")).toEqual("Nullam 1 Nullam (1)");
		expect(Tribe.incremented("Nullam 1 Nullam (1)")).toEqual("Nullam 1 Nullam (2)");
		expect(Tribe.incremented(".,.-?`!£+*ç%&/()=")).toEqual(".,.-?`!£+*ç%&/()= (1)");
		expect(Tribe.incremented("1.")).toEqual("1. (1)");
		expect(Tribe.incremented("1.1")).toEqual("1.1 (1)");
		expect(Tribe.incremented("Nullam (1.1)")).toEqual("Nullam (2.1)");
	});

});