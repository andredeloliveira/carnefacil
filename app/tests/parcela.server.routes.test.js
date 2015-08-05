'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Parcela = mongoose.model('Parcela'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, parcela;

/**
 * Parcela routes tests
 */
describe('Parcela CRUD tests', function() {
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

		// Save a user to the test db and create new Parcela
		user.save(function() {
			parcela = {
				name: 'Parcela Name'
			};

			done();
		});
	});

	it('should be able to save Parcela instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcela
				agent.post('/parcelas')
					.send(parcela)
					.expect(200)
					.end(function(parcelaSaveErr, parcelaSaveRes) {
						// Handle Parcela save error
						if (parcelaSaveErr) done(parcelaSaveErr);

						// Get a list of Parcelas
						agent.get('/parcelas')
							.end(function(parcelasGetErr, parcelasGetRes) {
								// Handle Parcela save error
								if (parcelasGetErr) done(parcelasGetErr);

								// Get Parcelas list
								var parcelas = parcelasGetRes.body;

								// Set assertions
								(parcelas[0].user._id).should.equal(userId);
								(parcelas[0].name).should.match('Parcela Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Parcela instance if not logged in', function(done) {
		agent.post('/parcelas')
			.send(parcela)
			.expect(401)
			.end(function(parcelaSaveErr, parcelaSaveRes) {
				// Call the assertion callback
				done(parcelaSaveErr);
			});
	});

	it('should not be able to save Parcela instance if no name is provided', function(done) {
		// Invalidate name field
		parcela.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcela
				agent.post('/parcelas')
					.send(parcela)
					.expect(400)
					.end(function(parcelaSaveErr, parcelaSaveRes) {
						// Set message assertion
						(parcelaSaveRes.body.message).should.match('Please fill Parcela name');
						
						// Handle Parcela save error
						done(parcelaSaveErr);
					});
			});
	});

	it('should be able to update Parcela instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcela
				agent.post('/parcelas')
					.send(parcela)
					.expect(200)
					.end(function(parcelaSaveErr, parcelaSaveRes) {
						// Handle Parcela save error
						if (parcelaSaveErr) done(parcelaSaveErr);

						// Update Parcela name
						parcela.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Parcela
						agent.put('/parcelas/' + parcelaSaveRes.body._id)
							.send(parcela)
							.expect(200)
							.end(function(parcelaUpdateErr, parcelaUpdateRes) {
								// Handle Parcela update error
								if (parcelaUpdateErr) done(parcelaUpdateErr);

								// Set assertions
								(parcelaUpdateRes.body._id).should.equal(parcelaSaveRes.body._id);
								(parcelaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parcelas if not signed in', function(done) {
		// Create new Parcela model instance
		var parcelaObj = new Parcela(parcela);

		// Save the Parcela
		parcelaObj.save(function() {
			// Request Parcelas
			request(app).get('/parcelas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Parcela if not signed in', function(done) {
		// Create new Parcela model instance
		var parcelaObj = new Parcela(parcela);

		// Save the Parcela
		parcelaObj.save(function() {
			request(app).get('/parcelas/' + parcelaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', parcela.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Parcela instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcela
				agent.post('/parcelas')
					.send(parcela)
					.expect(200)
					.end(function(parcelaSaveErr, parcelaSaveRes) {
						// Handle Parcela save error
						if (parcelaSaveErr) done(parcelaSaveErr);

						// Delete existing Parcela
						agent.delete('/parcelas/' + parcelaSaveRes.body._id)
							.send(parcela)
							.expect(200)
							.end(function(parcelaDeleteErr, parcelaDeleteRes) {
								// Handle Parcela error error
								if (parcelaDeleteErr) done(parcelaDeleteErr);

								// Set assertions
								(parcelaDeleteRes.body._id).should.equal(parcelaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Parcela instance if not signed in', function(done) {
		// Set Parcela user 
		parcela.user = user;

		// Create new Parcela model instance
		var parcelaObj = new Parcela(parcela);

		// Save the Parcela
		parcelaObj.save(function() {
			// Try deleting Parcela
			request(app).delete('/parcelas/' + parcelaObj._id)
			.expect(401)
			.end(function(parcelaDeleteErr, parcelaDeleteRes) {
				// Set message assertion
				(parcelaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Parcela error error
				done(parcelaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Parcela.remove().exec();
		done();
	});
});