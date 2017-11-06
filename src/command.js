#!/usr/bin/env node
import { Command } from "commander";
import { prompt } from "inquirer";
import FlatIconParser from "./flaticon.parser.js";
import Utils,{ getDefaultName, getClassName } from "./utils.js";


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
    .option('-n, --name', 'The name of the SVG icon as seen in FlatIcon\'s url')
    .option('-f, --filename <filename>', 'The new name we should give to the icon (we append .icon.js)')
    .option('-o, --output <output>', 'Save the SVG ouput in a different directory');


shell
    .command('search [name] [filename] [output]')
    .description('Search the given name as an icon on FlatIcon')
    .usage('-n database_148825 -f database -o assets/icons')
    .option('-n, --name <name>', 'The name of the SVG icon as seen in FlatIcon\'s url')
    .option('-f, --filename <filename>', 'The new name we should give to the icon (we append .icon.js)')
    .option('-o, --output <output>', 'Save the SVG ouput in a different directory')
    .action( (name, filename, output) => {

        if(name) {

            if( output === undefined) {
                console.log("Output dir not defined, using default one [assets/icons]");
            }

            if( filename === undefined) {
                filename = getDefaultName(name);
                console.log(`File's name not defined, using default one [${filename}]\n`);
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
                        throw Error("No icon name defined");
                    }

                    if(!answers.output) {
                        console.log("\nOutput directory not defined, using default one [assets/icons]\n");
                    }
        
                    if(!answers.filename) {
                        answers.filename = getDefaultName(answers.svg);
                        console.log(`File's name not defined, using default one [${answers.filename}]\n`);
                    }

                    data.svgName = answers.svg;
                    data.className = getClassName(answers.filename);
                    data.fileName = getDefaultName(answers.filename);
                    data.outputDir = answers.output ? answers.output : "assets/icons";

                    let parser = new FlatIconParser();
                    parser.getReactIcon(data);
                });
        }
    })

shell.parse(process.argv);