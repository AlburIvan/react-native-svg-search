import Utils, { 
    LogSeverity,
    log
} from "../utils.js";



/**
 * Hacky method that parses the SVG's XML and begins to sanitize and transform 
 * all the inputs to be compatible with react-native-svg.
 * 
 * Also here we get all the tags that needs to be imported on the file
 * 
 * @param {String} xml 
 */
module.exports.parseSVG = (svg) => {
   
    log(LogSeverity.INFO, 'Transforming FlatIcon SVG input to react-native compatible SVG...');
    
    // clean all the empty tags
    let sanitizedXml = svg.replace(/<.>(\r\n|\r|\n)<\/.>/g, '');

    // capitalize all the start/end tags
    let capitalizedXml = sanitizedXml
        .replace(/(?:<)(\w)/g, (x) => { 
            return '<' + x[1].toUpperCase()
        })
        .replace(/(?:<)\/(\w)/g, (x) => { 
            return '</' + x[2].toUpperCase()
        });


    let cleanedXml = capitalizedXml.split(/\r\n|\r|\n/)
        .filter((line)=> {
            return !(line.startsWith('<!') || line.startsWith('<?') || line === '');
        })
        .map((line, index) => {

            // remove useless id attr
            line = line.replace(/id="\w*"/g, '');

            // remove useless 'style' attr and extract the inside one
            line = line.replace(/style=\"(.*):(.*;)\"/g, '$1="$2"').replace('new','');

            // replace semicolon on attrs
            line = line.replace(';', '');

            // replace xmlns:space
            line = line.replace(/xml:space="preserve"/g,'')

            // special case
            if(line.includes("<Svg")) {

                line = line
                    // replace xmlns
                    .replace(/xmlns=".*g"/g,'')
                    // replace xmlns:link
                    .replace(/xmlns:xlink=".*k"/g, '')
                    // replace x property with width prop
                    .replace(/x="\w*."/g, 'width={this.props.width}')
                    // replace y property with height prop
                    .replace(/y="\w*."/g, 'height={this.props.height}')
                    
            }

            return line;
        })
        .join('\n');

    // get all the tags used
    let tags = cleanedXml.match(/(?:<)(\w*)/g);

    tags = tags.map((match) => {
        return match.replace('<','');
    });

    let imports = [];

    tags.forEach((element) => {
        if(!element || element === 'Svg') return;

        if(imports.indexOf(element) == -1) 
            imports.push(element);
    }, this);


    let clazz = {
        imports: imports,
        svg: cleanedXml
    }
    
    return clazz;
};