const log = require("./util/log");
const app = require('./app');
const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "test") {
        log.info(`Server started successfully. Listening on port ${PORT} ...`);
    }
});
