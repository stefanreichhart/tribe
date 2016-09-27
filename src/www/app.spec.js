describe('app.js / DB Mocks', function() {

	var $rootScope, $httpBackend, $controller, httpDatabase;
	var emptyDatabase = { members: [], groups: [] };

	beforeEach(module('tribeApplication'));

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		httpDatabase = $httpBackend.when('GET', '/data/database.json');
		$rootScope = $injector.get('$rootScope');
		$controller = $injector.get('$controller');
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should fail fetching the mock database (check httpBackend/mock)', function() {
		httpDatabase.respond(500, 'simulate error');
		$httpBackend.expectGET('/data/database.json');
		var controller = $controller('tribeController', { $scope: $rootScope });
		$httpBackend.flush();
		expect($rootScope.error).not.toBe(undefined);
		expect($rootScope.error).not.toBe(null);
		expect($rootScope.error).toBe('simulate error');

	});

	// dummy test, the behaviour will be different as soon as we have a real db connected
	it('should initialize an empty database if response was empty', function() {
		httpDatabase.respond(undefined);
		$httpBackend.expectGET('/data/database.json');
		var controller = $controller('tribeController', { $scope: $rootScope });
		$httpBackend.flush();
		expect($rootScope.database).toEqual({});
	});

	// dummy test, the behaviour will be different as soon as we have a real db connected
	it('should fetch an empty mock database', function() {
		httpDatabase.respond(emptyDatabase);
		$httpBackend.expectGET('/data/database.json');
		var controller = $controller('tribeController', { $scope: $rootScope });
		$httpBackend.flush();
		expect($rootScope.database).not.toBe(null);
		expect($rootScope.database).toEqual(emptyDatabase);
		expect($rootScope.database.members).not.toBe(undefined);
		expect($rootScope.database.members).not.toBe(null);
		expect($rootScope.database.members).toEqual([]);
		expect($rootScope.database.groups).not.toBe(undefined);
		expect($rootScope.database.groups).not.toBe(null);
		expect($rootScope.database.groups).toEqual([]);
	});

});

describe('app.js / DB functions', function() {
	var $rootScope, $httpBackend, $controller, httpDatabase;
	var emptyDatabase = { members: [], groups: [] };

	beforeEach(module('tribeApplication'));

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		httpDatabase = $httpBackend.when('GET', '/data/database.json');
		$rootScope = $injector.get('$rootScope');
		$controller = $injector.get('$controller');
		httpDatabase.respond(emptyDatabase);
		$httpBackend.expectGET('/data/database.json');
		$controller('tribeController', { $scope: $rootScope });
		$httpBackend.flush();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	// dummy test, the behaviour will be different as soon as we have a real db connected
	it('should return the first member id', function() {
		expect($rootScope.getNextMemberId()).toBe(1);
	});

	// dummy test, the behaviour will be different as soon as we have a real db connected
	it('should return the first group id', function() {
		expect($rootScope.getNextGroupId()).toBe(1);
	});

});