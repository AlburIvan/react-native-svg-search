import chalk from "chalk";

function Utils() {}

export function getDefaultName(name) {

    let filename = "default.icon.js";

    try {
        name = name
            // replace all dots
            .replace(/\./g, '')
            // replace all dashes
            .replace(/\-/g, '')
            // to lowercase
            .toLowerCase();

        if(name.includes('_'))
            filename = `${name.substring(0, name.indexOf('_'))}.icon.js`;
        else
            filename = `${name}.icon.js`;

        return filename;
    } catch (error) {
        log(LogSeverity.DEBUG, error);
    }

    return filename;
}


export function getClassName(filename) {

    let tmpName = "DefaultIcon";

    try {
        filename = filename
            // replace all dots
            .replace(/\./g, '')
            // replace all underscores
            .replace(/\_/g, '')
            // replace all dashes
            .replace(/[0-9]/g, '')
            // to lowercase
            .toLowerCase();

        filename = filename.split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');

        let className = `${filename.charAt(0).toUpperCase() + filename.slice(1)}Icon`;
        
        return className;
    }
    catch(error) {
        log(LogSeverity.DEBUG, error);
    }

    return tempName;
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