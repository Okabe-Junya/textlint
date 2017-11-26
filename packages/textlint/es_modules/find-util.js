// LICENSE : MIT
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pathToGlob = require("path-to-glob-pattern");
var glob = require("glob");
var path = require("path");
var fs = require("fs");
var isFile = function(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
};
/**
 * filter files by config
 * @param {string[]} patterns glob patterns
 * @param {{extensions?: string[], cwd?: string }} options
 */
function pathsToGlobPatterns(patterns, options) {
    if (options === void 0) {
        options = {};
    }
    var processPatterns = pathToGlob({
        extensions: options.extensions || [],
        cwd: options.cwd || process.cwd()
    });
    return patterns.map(processPatterns);
}
exports.pathsToGlobPatterns = pathsToGlobPatterns;
/**
 * found files by glob pattern
 * @param {string[]} patterns
 * @param {{cwd?: string }} options
 * @returns {string[]} file path list
 */
function findFiles(patterns, options) {
    if (options === void 0) {
        options = {};
    }
    var cwd = options.cwd || process.cwd();
    var files = [];
    var addFile = function(filePath) {
        if (files.indexOf(filePath) === -1) {
            files.push(filePath);
        }
    };
    patterns.forEach(function(pattern) {
        var file = path.resolve(cwd, pattern);
        if (isFile(file)) {
            addFile(fs.realpathSync(file));
        } else {
            glob
                .sync(pattern, {
                    nodir: true
                })
                .forEach(function(filePath) {
                    // workaround for windows
                    // https://github.com/isaacs/node-glob/issues/74#issuecomment-31548810
                    addFile(path.resolve(filePath));
                });
        }
    });
    return files;
}
exports.findFiles = findFiles;
/**
 * @param {string[]} files
 * @param {{extensions?: string[]}} [options]
 * @returns {{availableFiles: string[], unAvailableFiles: string[]}}
 */
function separateByAvailability(files, options) {
    if (options === void 0) {
        options = {};
    }
    var extensions = options.extensions || [];
    var availableFiles = [];
    var unAvailableFiles = [];
    files.forEach(function(filePath) {
        var extname = path.extname(filePath);
        if (extensions.indexOf(extname) === -1) {
            unAvailableFiles.push(filePath);
        } else {
            availableFiles.push(filePath);
        }
    });
    return {
        availableFiles: availableFiles,
        unAvailableFiles: unAvailableFiles
    };
}
exports.separateByAvailability = separateByAvailability;
