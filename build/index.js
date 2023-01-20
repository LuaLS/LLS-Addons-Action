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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const submoduleRegex = /([A-z0-9]+) (.*\/.*) .*/g;
function getDirectorySize(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalSize = 0;
        const files = yield fs.promises.readdir(directory);
        for (const file of files) {
            const filePath = `${directory}/${file}`;
            const fileStat = yield fs.promises.stat(filePath);
            if (fileStat.isDirectory()) {
                totalSize += yield getDirectorySize(filePath);
            }
            else {
                totalSize += fileStat.size;
            }
        }
        return totalSize;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const git = (0, simple_git_1.default)();
            const submoduleList = yield git.subModule();
            for (const submoduleMatch of submoduleList.matchAll(submoduleRegex)) {
                const sha = submoduleMatch[1];
                const submodulePath = submoduleMatch[2];
                const infoFilePath = path_1.default.join(submodulePath, "info.json");
                const rawInfo = yield fs.promises.readFile(infoFilePath);
                const info = JSON.parse(rawInfo.toString());
                info.size = yield getDirectorySize(submodulePath);
                info.hasPlugin = fs.existsSync(path_1.default.join(submodulePath, "module", "plugin.lua"));
                fs.promises.writeFile(infoFilePath, JSON.stringify(info, null, "  "));
            }
        }
        catch (error) {
            if (error instanceof Error)
                return core.setFailed(error.message);
            return core.setFailed(error);
        }
    });
}
run();
