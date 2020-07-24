const log = require("./util/log");
const app = require('./app');
const startupService = require("./modules/startup");
const PORT = process.env.PORT || 8000;

// Initialise all services then start server
(async () => {
    await startupService.initialise();
    log.info(`Successfully initialised services. Starting server..`);
    app.listen(PORT, () => {
        log.info(`Server started successfully. Listening on port:${PORT}`);
    });
})();
