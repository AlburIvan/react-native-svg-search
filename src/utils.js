import chalk from "chalk";

function Utils() {}

export function getDefaultName(name) {
    
    let tempName = "default.icon.js";

    name = name
        // replace all dots
        .replace(/\./g, '')
        // to lowercase
        .toLowerCase();

    if(name.includes('_'))
        tempName = `${name.substring(0, name.indexOf('_'))}.icon.js`;
    else
        tempName = `${name}.icon.js`;

    return tempName;
}


export function getClassName(filename) {

    let tmpName = "DefaultIcon";

    try {
        filename = filename
            // replace all dots
            .replace(/\./g, '')
            // replace all dots
            .replace(/\_/g, '')
            // to lowercase
            .toLowerCase();

        let className = `${filename.charAt(0).toUpperCase() + filename.slice(1)}Icon`;
        
        return className;
    }
    catch(err) {
        return tmpName;
    }

}

export function log(severity, msg) {

    let tag = "";

    switch (severity) {
        case LogSeverity.DEBUG:
            tag = chalk.blue('[debug] -> ');
            break;

        case LogSeverity.INFO:
            tag = chalk.yellow('[info] -> ');
        break;

        case LogSeverity.ERROR:
            tag = chalk.red('[error] -> ');
        break;
    
        case LogSeverity.SUCCESS:
            tag = chalk.green('[success] -> ');
        break;

        default:
            tag = chalk.blue('[debug] -> ');
            break;
    }

    console.log(`${tag} ${msg}`);
}


export const LogSeverity = {
    DEBUG: 0,
    INFO: 1,
    ERROR: 2,
    SUCCESS: 3,
}