#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const yargs = require("yargs")

let IS_CLONE_SUCCESS = false;

/**
 * @type {[]}
 */
const args = yargs.argv;
const gitUrl = "https://github.com/Kreeda-Studios/express-on-steroids.git";
/**
 * @type {String}
 */
const targetProjectName = sanitize(yargs.argv._[0]) || "express-on-steroids";

/**
 *
 * @param {String} input
 */
function sanitize(input) {
  const alphabetRegex = /^[a-zA-Z./\\]+$/;
  if (!alphabetRegex.test(input)) {
    throw new Error("please provide valid project name.");
  }

  return input;
}

function cleanup() {
  console.log();
  console.log("=========== cleaning up... ===========");
  try {
    console.log("removing: ", path.join(".", targetProjectName));

    fs.rmSync(path.join(".", targetProjectName), {
      recursive: true,
      force: true,
    });
    console.log("cleanup success");
  } catch (error) {
    console.log("cleanup failed. :-(");
  }
  console.log("======================");
}

function handleSigint() {
  if (IS_CLONE_SUCCESS) {
    cleanup();
  }
  console.log();
  console.log("exiting");
  console.log();
  process.exit();
}

function handleError(e) {
  console.error("error: ", e);
  if (IS_CLONE_SUCCESS) {
    cleanup();
  }
  process.exit(1);
}

function npmInstall() {
  console.log();
  console.log("=========== installing dependencies with npm... ===========");
  try {
    const result = child_process.execSync(
      `cd ${path.join(".", targetProjectName)} && npm install`
    );
    console.log(result.toString());
    console.log("npm dependencies installed");
  } catch (error) {
    console.log("failed to install deps");
  }
  console.log("===================");
}

function cloneRepo() {
  console.log();
  console.log("=========== cloning eos... ===========");
  const result = child_process.execSync(
    `git clone ${gitUrl} ${targetProjectName}`
  );
  console.log("clone success");
  IS_CLONE_SUCCESS = true;
  console.log(result.toString());
  console.log("====================");
}

function renameProject() {
  console.log();
  console.log("=========== adding final touches... ===========");
  try {
    fs.rmSync(path.join(".", targetProjectName, "package-lock.json"));
  } catch (error) {}
  // console.log("reading package.json");
  try {
    const json = JSON.parse(
      fs.readFileSync(path.join(".", targetProjectName, "package.json"))
    );
    json["name"] = targetProjectName;
    json["version"] = "1.0.0";
    json["description"] = "project bootstrapped with create-eos-app";
    console.log("modifying package.json");
    fs.writeFileSync(
      path.join(".", targetProjectName, "package.json"),
      JSON.stringify(json)
    );
    console.log("done");
  } catch (error) {
    console.log("failed to add final touches. :-(");
  }
  console.log("=========================");
}
function openWithCode() {
  console.log("opening with code");
  try {
    child_process.execSync(`code ${path.join(".", targetProjectName)}`);
  } catch (error) {
    console.error("failed to open project with code...");
  }
}

function printKreedaAsciiArt() {
  console.log();
  console.log(`  _   __  __ __                 _         _       _          `);
  console.log(
    ` | | / / / / \\ \\               | |       | |     | |         `
  );
  console.log(` | |/ / | |_ _| |  ___  ___  __| | __ _  | | __ _| |__  ___  `);
  console.log(
    ` |    \\/ /| '__\\ \\/ _ \\/ _ \\/ _\` |/ _\` | | |/ _\` | '_ \\/ __| `
  );
  console.log(
    ` | |\\  \\ \\| |  / /  __/  __/ (_| | (_| | | | (_| | |_) \\__ \\ `
  );
  console.log(
    ` \\_| \\_/| |_| | | \\___|\\___|\\__,_|\\__,_| |_|\\__,_|_.__/|___/ `
  );
  console.log(
    `         \\_\\ /_/                                             `
  );
  console.log(`                                                             `);
}

process.on("SIGINT", handleSigint);
process.on("uncaughtException", handleError);

// console.log("yargs", args)
// console.log("args ", process.argv);
console.log();
console.log("Hello, from Kreeda Labs Team.");

cloneRepo();
npmInstall();
renameProject();
if (args["code"]) {
  console.log("opening with code");
  openWithCode();
}

printKreedaAsciiArt();

console.log();
console.log(
  "check out express-on-steroids: https://github.com/Kreeda-Studios/express-on-steroids"
);
console.log(
  `run "cd ${targetProjectName}" and "npm start" to see express on steroids in action.`
);
console.log("Bye Bye...");
console.log();


