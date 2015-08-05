'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Carne = mongoose.model('Carne'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, carne;

/**
 * Carne routes tests
 */
describe('Carne CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Carne
		user.save(function() {
			carne = {
				name: 'Carne Name'
			};

			done();
		});
	});

	it('should be able to save Carne instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carne
				agent.post('/carnes')
					.send(carne)
					.expect(200)
					.end(function(carneSaveErr, carneSaveRes) {
						// Handle Carne save error
						if (carneSaveErr) done(carneSaveErr);

						// Get a list of Carnes
						agent.get('/carnes')
							.end(function(carnesGetErr, carnesGetRes) {
								// Handle Carne save error
								if (carnesGetErr) done(carnesGetErr);

								// Get Carnes list
								var carnes = carnesGetRes.body;

								// Set assertions
								(carnes[0].user._id).should.equal(userId);
								(carnes[0].name).should.match('Carne Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Carne instance if not logged in', function(done) {
		agent.post('/carnes')
			.send(carne)
			.expect(401)
			.end(function(carneSaveErr, carneSaveRes) {
				// Call the assertion callback
				done(carneSaveErr);
			});
	});

	it('should not be able to save Carne instance if no name is provided', function(done) {
		// Invalidate name field
		carne.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carne
				agent.post('/carnes')
					.send(carne)
					.expect(400)
					.end(function(carneSaveErr, carneSaveRes) {
						// Set message assertion
						(carneSaveRes.body.message).should.match('Please fill Carne name');
						
						// Handle Carne save error
						done(carneSaveErr);
					});
			});
	});

	it('should be able to update Carne instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carne
				agent.post('/carnes')
					.send(carne)
					.expect(200)
					.end(function(carneSaveErr, carneSaveRes) {
						// Handle Carne save error
						if (carneSaveErr) done(carneSaveErr);

						// Update Carne name
						carne.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Carne
						agent.put('/carnes/' + carneSaveRes.body._id)
							.send(carne)
							.expect(200)
							.end(function(carneUpdateErr, carneUpdateRes) {
								// Handle Carne update error
								if (carneUpdateErr) done(carneUpdateErr);

								// Set assertions
								(carneUpdateRes.body._id).should.equal(carneSaveRes.body._id);
								(carneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Carnes if not signed in', function(done) {
		// Create new Carne model instance
		var carneObj = new Carne(carne);

		// Save the Carne
		carneObj.save(function() {
			// Request Carnes
			request(app).get('/carnes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Carne if not signed in', function(done) {
		// Create new Carne model instance
		var carneObj = new Carne(carne);

		// Save the Carne
		carneObj.save(function() {
			request(app).get('/carnes/' + carneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', carne.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Carne instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carne
				agent.post('/carnes')
					.send(carne)
					.expect(200)
					.end(function(carneSaveErr, carneSaveRes) {
						// Handle Carne save error
						if (carneSaveErr) done(carneSaveErr);

						// Delete existing Carne
						agent.delete('/carnes/' + carneSaveRes.body._id)
							.send(carne)
							.expect(200)
							.end(function(carneDeleteErr, carneDeleteRes) {
								// Handle Carne error error
								if (carneDeleteErr) done(carneDeleteErr);

								// Set assertions
								(carneDeleteRes.body._id).should.equal(carneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Carne instance if not signed in', function(done) {
		// Set Carne user 
		carne.user = user;

		// Create new Carne model instance
		var carneObj = new Carne(carne);

		// Save the Carne
		carneObj.save(function() {
			// Try deleting Carne
			request(app).delete('/carnes/' + carneObj._id)
			.expect(401)
			.end(function(carneDeleteErr, carneDeleteRes) {
				// Set message assertion
				(carneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Carne error error
				done(carneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Carne.remove().exec();
		done();
	});
});