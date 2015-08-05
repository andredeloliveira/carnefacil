'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cliente = mongoose.model('Cliente'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cliente;

/**
 * Cliente routes tests
 */
describe('Cliente CRUD tests', function() {
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

		// Save a user to the test db and create new Cliente
		user.save(function() {
			cliente = {
				name: 'Cliente Name'
			};

			done();
		});
	});

	it('should be able to save Cliente instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cliente
				agent.post('/clientes')
					.send(cliente)
					.expect(200)
					.end(function(clienteSaveErr, clienteSaveRes) {
						// Handle Cliente save error
						if (clienteSaveErr) done(clienteSaveErr);

						// Get a list of Clientes
						agent.get('/clientes')
							.end(function(clientesGetErr, clientesGetRes) {
								// Handle Cliente save error
								if (clientesGetErr) done(clientesGetErr);

								// Get Clientes list
								var clientes = clientesGetRes.body;

								// Set assertions
								(clientes[0].user._id).should.equal(userId);
								(clientes[0].name).should.match('Cliente Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cliente instance if not logged in', function(done) {
		agent.post('/clientes')
			.send(cliente)
			.expect(401)
			.end(function(clienteSaveErr, clienteSaveRes) {
				// Call the assertion callback
				done(clienteSaveErr);
			});
	});

	it('should not be able to save Cliente instance if no name is provided', function(done) {
		// Invalidate name field
		cliente.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cliente
				agent.post('/clientes')
					.send(cliente)
					.expect(400)
					.end(function(clienteSaveErr, clienteSaveRes) {
						// Set message assertion
						(clienteSaveRes.body.message).should.match('Please fill Cliente name');
						
						// Handle Cliente save error
						done(clienteSaveErr);
					});
			});
	});

	it('should be able to update Cliente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cliente
				agent.post('/clientes')
					.send(cliente)
					.expect(200)
					.end(function(clienteSaveErr, clienteSaveRes) {
						// Handle Cliente save error
						if (clienteSaveErr) done(clienteSaveErr);

						// Update Cliente name
						cliente.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cliente
						agent.put('/clientes/' + clienteSaveRes.body._id)
							.send(cliente)
							.expect(200)
							.end(function(clienteUpdateErr, clienteUpdateRes) {
								// Handle Cliente update error
								if (clienteUpdateErr) done(clienteUpdateErr);

								// Set assertions
								(clienteUpdateRes.body._id).should.equal(clienteSaveRes.body._id);
								(clienteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Clientes if not signed in', function(done) {
		// Create new Cliente model instance
		var clienteObj = new Cliente(cliente);

		// Save the Cliente
		clienteObj.save(function() {
			// Request Clientes
			request(app).get('/clientes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cliente if not signed in', function(done) {
		// Create new Cliente model instance
		var clienteObj = new Cliente(cliente);

		// Save the Cliente
		clienteObj.save(function() {
			request(app).get('/clientes/' + clienteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cliente.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cliente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cliente
				agent.post('/clientes')
					.send(cliente)
					.expect(200)
					.end(function(clienteSaveErr, clienteSaveRes) {
						// Handle Cliente save error
						if (clienteSaveErr) done(clienteSaveErr);

						// Delete existing Cliente
						agent.delete('/clientes/' + clienteSaveRes.body._id)
							.send(cliente)
							.expect(200)
							.end(function(clienteDeleteErr, clienteDeleteRes) {
								// Handle Cliente error error
								if (clienteDeleteErr) done(clienteDeleteErr);

								// Set assertions
								(clienteDeleteRes.body._id).should.equal(clienteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cliente instance if not signed in', function(done) {
		// Set Cliente user 
		cliente.user = user;

		// Create new Cliente model instance
		var clienteObj = new Cliente(cliente);

		// Save the Cliente
		clienteObj.save(function() {
			// Try deleting Cliente
			request(app).delete('/clientes/' + clienteObj._id)
			.expect(401)
			.end(function(clienteDeleteErr, clienteDeleteRes) {
				// Set message assertion
				(clienteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cliente error error
				done(clienteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cliente.remove().exec();
		done();
	});
});