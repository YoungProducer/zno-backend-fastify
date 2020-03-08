// Required to get normal stacktrace with references to source (typescript) files
require('source-map-support').install()

console.log(process.env);

const mode = process.env.NODE_ENV || 'production';

const instancePath = mode === 'development'
    ? '../lib/index'
    : '../dist/lib/index';

// Require fastify instance
const app = require(instancePath).instance

// Start listening on 3000 port
app.listen(4000, (err) => {
    if (err) throw err;

    console.log(`Application is ready and listening on http://localhost:3000`);
    console.log(`Available routes:`);
    console.log(app.printRoutes());
});