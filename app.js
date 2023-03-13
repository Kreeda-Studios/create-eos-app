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

function cleanup(){
  console.log("cleaning up...");
  fs.rmSync(path.join(baseDir, targetProjectName), {recursive:true, force: true})
}

function handleSigint(){
  cleanup();
  console.log("exiting")
  process.exit();
}

function handleError(e){
  console.error("eroor", e);
  cleanup();
  process.exit()
}

function npmInstall() {
  console.log("installing dependencies with npm");
  const result = child_process.execSync(
    `cd ${path.join(baseDir, targetProjectName)} && npm install`
  );
  console.log("Finished installing dependencies. result: ", result.toString());
}

function cloneRepo() {
  console.log("cloning eos");
  const result = child_process.execSync(
    `git clone ${gitUrl} ${targetProjectName}`
  );
  console.log("clone success");
  console.log(result.toString());
}
function renameProject(){
  console.log("removing package-lock")
  fs.rmSync(path.join(baseDir, targetProjectName, "package-lock.json"));
  console.log("reading package.json")
  const json = JSON.parse(fs.readFileSync(path.join(baseDir, targetProjectName, "package.json")));
  json["name"] = targetProjectName;
  json["version"] = "1.0.0";
  json["description"] = "project bootstrapped with create-eos-app"
  console.log("modifying package.json")
  fs.writeFileSync(path.join(baseDir, targetProjectName, "package.json"), JSON.stringify(json));
  console.log("renamed project")
}
function openWithCode(){
  child_process.execSync(`code ${path.join(".", targetProjectName)}`)
}

process.on("SIGINT", handleSigint);
process.on("uncaughtException", handleError)

const baseDir = path.join(__dirname);
// console.log("baseDir ",baseDir)
// console.log("yargs", args)
// console.log("args ", process.argv);
cloneRepo()
renameProject()
npmInstall()
if(args["code"]){
  console.log("opening with code")
  openWithCode()
}
function doStupidThings(){
  const ceaPath = path.join(".", "packages", "create-eos-app")
  const result = child_process.execSync(`npx ./${ceaPath} ${process.argv.join(" ")} --baseDir ${baseDir}`)
  console.log(result.toString())
  // require(`./${ceaPath}`).abc()
}
// doStupidThings();
