var siege = require('siege');

siege(__dirname + '/express.js')
  .on(4000)
  .for(10000).times
  .get('/')
  .get('/user/abcdefg')
  .attack()

// siege(__dirname + '/app.js')
//   .on(4001)
//   .for(10000).times
//   .get('/')
//   .get('/user/abcdefg')
//   .attack()

// siege(__dirname + '/node.js')
//   .for(10000).times
//   .get('/')
//   .get('/user/abcdefg')
//   .attack()
