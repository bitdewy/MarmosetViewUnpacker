// bitdewy@gmail.com

'use strict';

var test = require('unit.js');

test.httpAgent('http://localhost')
	.get('/')
    .expect(200)
    .end(function(err, res) {
		if (err) {
          test.fail(err.message);
        }
	});

