#!/usr/bin/env node
// import Example from "./example";
import {
    Command
} from "commander";

import {
    prompt
} from "inquirer";


// https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs
const shell = new Command();

const questions = [
    {
        type : 'input',
        name : 'svg',
        message : 'Whats the name of the Icon:'
    },
    {
        type : 'input',
        name : 'filename',
        message : 'Whats name should we give the new SVG icon:'
    }
];


shell
    .version('0.0.1')
    .description('This CLI gets an icon from FlatIcon and ouputs the react-native compatible SVG in a folder');


shell
    .command('search-svg <svg>')
    .alias('')
    .description('Search the given icon name at FlatIcon')
    .action(() =>{
        prompt(questions)
            .then((answers) => {
                console.log(`lookup::icon : ${answers.svg}`);
                console.log(`create::file : ${answers.filename}`);
            })
    })

shell.parse(process.argv);