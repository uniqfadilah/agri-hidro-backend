"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const models_1 = require("../src/models");
const models_2 = require("../src/models");
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminadmin';
const SALT_ROUNDS = 10;
async function seed(knex) {
    (0, models_1.bindKnex)(knex);
    const existing = await models_2.User.query().findOne({ username: ADMIN_USERNAME });
    if (existing) {
        return;
    }
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await models_2.User.query().insert({
        id: (0, node_crypto_1.randomUUID)(),
        username: ADMIN_USERNAME,
        password: hashedPassword,
        role: 'admin',
    });
}
//# sourceMappingURL=01_admin_user.js.map