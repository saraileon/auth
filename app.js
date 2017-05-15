const express 	 = require('express');
const http 			 = require('http');
const bodyParser = require('body-parser');
const morgan 		 = require('morgan');
const router 		 = require('./router');
const mongoose 	 = require('mongoose');
const logger 		 = require('winston-color');


// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

const app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // replace '*' with the domain you're allowing cors
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

	next();
};

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

// Allow CORS
app.use(allowCrossDomain);

// Router Setup
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(' ');
logger.info('Server listening on: ', port);
logger.info('---------------------------');

