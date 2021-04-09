"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = require("mongoose");
const api_1 = __importDefault(require("./routes/api"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
require("./middleware/passport");
const express_session_1 = __importDefault(require("express-session"));
const config_1 = __importDefault(require("./config"));
const app = express_1.default();
app.use(body_parser_1.json());
const corsHandler = cors_1.default({
    origin: [config_1.default.APP_SERVER_FRONT_END ? config_1.default.APP_SERVER_FRONT_END : 'http://localhost:80'],
    methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
});
app.use(corsHandler);
app.use(express_session_1.default({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use([passport_1.default.initialize(), passport_1.default.session()]);
app.use(api_1.default);
mongoose_1.connect(`mongodb://${config_1.default.DB_USERNAME}:${config_1.default.DB_PASSWORD}@${config_1.default.DB_DOMAIN}/${config_1.default.DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => {
        console.log(`app is up and listening on port 80`);
    });
});
