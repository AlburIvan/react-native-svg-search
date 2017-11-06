#!/usr/bin/env node
import { Command } from "commander";
import { prompt } from "inquirer";
import FlatIconParser from "./parsers/flaticon.parser";
import Utils,{ getDefaultName, getClassName, LogSeverity, log } from "./utils.js";


const shell = new Command();

let data = {
    svgName: "",
    fileName: "",
    className: "",
    outputDir: ""
}

const questions = [
    {
        type : 'input',
        name : 'svg',
        message : 'Whats the name of the Icon:'
    },
    {
        type : 'input',
        name : 'filename',
        message : 'What name should the new file have (we will append .icon.js):'
    },
    {
        type : 'input',
        name : 'output',
        message : 'Where should we save the new file (default assets/icons):'
    }
];


shell
    .version('1.0.0')
    .description('This CLI gets an icon from FlatIcon and ouputs the react-native compatible SVG in a folder')


shell
    .command('search [name] [filename] [output]')
    .description('Search the given name as an icon on FlatIcon')
    .usage('-n database_148825 -f database -o assets/icons')
    .option('-n, --name <name>', 'The name of the SVG icon as seen in FlatIcon\'s url')
    .option('-f, --filename <filename>', 'The new name we should give to the icon (we append .icon.js)')
    .option('-o, --output <output>', 'Save the SVG ouput in a different directory')
    .action( (name, filename, output) => {

        if(name) {

            if(output === undefined) {
               log(LogSeverity.INFO, "Output dir not defined, using default one [assets/icons]");
            }

            if(filename === undefined) {
                log(LogSeverity.INFO, `File name not defined, using default one [${getDefaultName(filename)}]\n`);
            }

            data.svgName = name;
            data.className = getClassName(filename);
            data.fileName = getDefaultName(filename);
            data.outputDir = output === undefined ? "assets/icons" : output;

            let parser = new FlatIconParser();
            parser.getReactIcon(data);
        }
        else {
            prompt(questions)
                .then((answers) => {

                    if(!answers.svg) {
                        log(LogSeverity.ERROR, "No icon name defined, try again...");
                        return;
                    }

                    if(!answers.output) {
                        log(LogSeverity.INFO, "Output directory not defined, using default one [assets/icons]\n");
                    }
        
                    if(!answers.filename) {
                        log(LogSeverity.INFO, `File's name not defined, using default one [${getDefaultName(answers.filename)}]\n`);
                    }

                    data.svgName = answers.svg;
                    data.className = getClassName(answers.filename);
                    data.fileName = answers.filename ? getDefaultName(answers.filename) : getDefaultName(answers.svg);
                    data.outputDir = answers.output ? answers.output : "assets/icons";

                    let parser = new FlatIconParser();
                    parser.getReactIcon(data);
                })
                .catch((err) => {
                    log(LogSeverity.ERROR, err);
                });
        }
    })


shell
    .command('convert [output]')
    .description('...')
    .option('-o, --output <output>', 'Save the ouput in a different directory')
    .action( (dir) => {
        log(LogSeverity.DEBUG, 'Not yet implemented!');
    });

shell.parse(process.argv);