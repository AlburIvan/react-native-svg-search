#!/usr/bin/env node
import {
    Command
} from "commander";

import {
    prompt
} from "inquirer";

import FlatIconParser from "./flaticon.parser.js";


// https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs
const shell = new Command();

const questions = [
    {
        type : 'input',
        name : 'svg',
        message : 'Whats the name of the Icon:'
    },
    // {
    //     type : 'input',
    //     name : 'filename',
    //     message : 'Whats name should we give the new SVG icon:'
    // }
];


shell
    .version('0.0.1')
    .description('This CLI gets an icon from FlatIcon and ouputs the react-native compatible SVG in a folder');

// https://www.flaticon.com/free-icon/looking_230295
// https://image.flaticon.com/icons/svg/230/230295.svg
shell
    .command('search-svg [svg] [filename]')
    .alias('')
    .description('Search the given icon name at FlatIcon')
    .action((svg, filename) => {

        if(!svg) {
            prompt(questions)
            .then((answers) => {

                let parser = new FlatIconParser();

                parser.getReactIcon(answers);
            });
        } else {
            let parser = new FlatIconParser();
            parser.getReactIcon(svg, true);
        }
       
    })

shell.parse(process.argv);
