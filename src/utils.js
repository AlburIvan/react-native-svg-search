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