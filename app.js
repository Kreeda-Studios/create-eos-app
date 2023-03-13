#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const yargs = require("yargs")

/**
 * @type {[]}
 */
const args = yargs.argv
// const gitUrl = "https://github.com/facebook/create-react-app.git";
const gitUrl = "https://github.com/Kreeda-Studios/express-on-steroids.git";
const targetProjectName = yargs.argv._[0] || "express-on-steroids";

function cleanup() {
  console.log("cleaning up...");
  try {
    console.log("removing: ", path.join(".", targetProjectName));
    fs.rmSync(path.join(".", targetProjectName), {
      recursive: true,
      force: true,
    });
  } catch (error) {
    console.log("cleanup failed. :-(");
  }
}

function handleSigint() {
  cleanup();
  console.log("exiting");
  process.exit();
}

function handleError(e) {
  console.error("eroor", e);
  cleanup();
  process.exit();
}

function npmInstall() {
  console.log("installing dependencies with npm");
  try {
    const result = child_process.execSync(
      `cd ${path.join(".", targetProjectName)} && npm install`
    );
    console.log("npm deps installation result: ", result.toString());
  } catch (error) {
    console.log("failed to install deps");
  }
}

function cloneRepo() {
  console.log("cloning eos");
  const result = child_process.execSync(
    `git clone ${gitUrl} ${targetProjectName}`
  );
  console.log("clone success");
  console.log(result.toString());
}

function renameProject() {
  console.log("removing package-lock");
  try {
    fs.rmSync(path.join(".", targetProjectName, "package-lock.json"));
  } catch (error) {
    console.log("failed to remove package-lock.json");
  }
  console.log("reading package.json");
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
    console.log("renamed project");
  } catch (error) {
    console.log("failed to rename project");
  }
}
function openWithCode() {
  child_process.execSync(`code ${path.join(".", targetProjectName)}`);
}

process.on("SIGINT", handleSigint);
process.on("uncaughtException", handleError);

// console.log("yargs", args)
// console.log("args ", process.argv);
cloneRepo();
npmInstall();
renameProject();
console.log(
  "check out express-on-steroids: https://github.com/Kreeda-Studios/express-on-steroids"
);
if (args["code"]) {
  console.log("opening with code");
  openWithCode();
}

