"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const config_1 = require("./config");
const oicq_1 = require("@cummins/oicq");
/**
 * ð¤ðð¥°ð¥µð¤¨ð¥¥ðððððªð®ð¹
 * æ è§åå½åæ³ð¥µð¥°ð¥°ð¥°
 */
/** create clientð¥° */
class client {
    static async create() {
        await Initbot.init();
        const { bot: bot_, platform: platform_ } = config_1.config.returnconfig();
        const bot = oicq_1.createClient(bot_, { platform: platform_ });
        login.loginmethod(bot);
        return bot;
    }
}
exports.client = client;
/** initialization */
class Initbot {
    static async init() {
        const list = config_1.config.readlist();
        /** include config.json? */
        if (!(list.includes("config.json"))) {
            config_1.config.create();
            config_1.config.rename();
            config_1.config.initwriteconfig();
            await config_1.config.sysin();
            await config_1.config.verifymethod();
        }
    }
}
/** login method class */
class login {
    static loginmethod(bot) {
        const { mode, password: password_, verifymethod } = config_1.config.returnconfig();
        const password = Buffer.from(password_, "base64").toString();
        /** qrcode login */
        if (mode === "qrcode") {
            bot.on("system.login.qrcode", function (e) {
                //æ«ç åæåè½¦ç»å½
                this.logger.mark("æ«ç åæEnterå®æç»å½");
                process.stdin.once("data", () => {
                    this.login();
                });
            }).login();
            return;
        }
        /** æ³å¿ä¸ç¨æè¯´äºå§ð¤ */
        if (verifymethod === "urlverify") {
            bot.on("system.login.slider", function (event) {
                process.stdin.once("data", sysin => {
                    const input = String(sysin).trim();
                    this.sliderLogin(input);
                });
            }).on("system.login.device", function (event) {
                process.stdin.once("data", () => {
                    this.login();
                });
            }).login(password);
        }
        else {
            bot.on("system.login.slider", function (event) {
                process.stdin.once("data", sysin => {
                    const input = String(sysin).trim();
                    this.sliderLogin(input);
                });
            }).on("system.login.device", function (event) {
                this.sendSmsCode();
                process.stdin.once("data", sysin => {
                    this.logger.mark("è¾å¥æ¶å°çéªè¯ç ");
                    const SMScode = String(sysin).trim();
                    this.submitSmsCode(SMScode);
                    this.login();
                });
            }).login(password);
        }
    }
}
