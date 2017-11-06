
import fs from "fs";
import axios from "axios";
import mkdirp from "mkdirp";
import debug from "debug";

/**
 * This is a specific parser for https://FlatIcon.com 's free icons, 
 * the goal of this CLI is to provide a faster way to include
 * SVG icons in your react-native project.
 */
export default class FlatIconParser {

    /**
     * Constructor used to initialize data object
     */
    constructor() {
        this.data = null;
    }

    /**
     * Controls the flow of the CLI, all steps are pipelined from here
     * 
     * @param {Array} data 
     */
    getReactIcon(data) {

        this.data = data;
        
        let url = this._getdownloadURL(data.svgName);
        let iconXml = this._downloadIcon(url);

        iconXml
            .then((resp) => {

                if(resp == 500) {
                    throw Error("For some reason we couldn't reach flaticon.com's servers, try again later...");
                }

                if(resp == 404) {
                    throw Error("Couldn't find the specified icon, either there was a mistake copying the name or the icon is premium, try again...");
                }

                return resp;
            })
            .then((resp) => {
                return this._parseXml(resp);
            })
            .then((clazz) => {
                return this._createReactComponent(clazz);
            })
            .then((component) => {
               return this._saveComponent(data, component);
            })
            .catch((err) => {
                console.log(err.message);
                console.log("\n\n[if you believe this is a mistake please open an issue @ https://github.com/AlburIvan/react-native-svg-search/issues]");
            });
    }



    /**
     * Hacky method that parses the SVG's XML and begins to sanitize and transform 
     * all the inputs to be compatible with react-native-svg.
     * 
     * Also here we get all the tags that needs to be imported on the file
     * 
     * @param {String} xml 
     */
    _parseXml(xml) {

        console.log('Transforming FlatIcon SVG input to react-native compatible SVG...\n');

        // clean all the empty tags
        let sanitizedXml = xml.replace(/<.>(\r\n|\r|\n)<\/.>/g, '');

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
    }

    _createReactComponent(clazz) {

        console.log("Creating React-Native component...\n");

        let reactClass = 
`
import React, { Component } from "react";

import Svg, { ${clazz.imports} } from "react-native-svg";

export default class ${this.data.className} extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            ${clazz.svg}
        );
    }
}`;
        console.log("React-Native component created...\n");

        return reactClass;
    }


    /**
     * This method is in charge of saving the component in the specified output directory,
     * if the directory doesn't exists it will create a new one.
     * 
     * @param {Array} data
     * @param {ReactClass} component 
     */
    _saveComponent(data, component) {
       
        console.log(`Saving new component on ${data.outputDir}\n`);

        this._dirExistsOrCreate(data.outputDir)
            .then((message) => {

                let path = `${data.outputDir}/${data.fileName}`

                fs.writeFile(path, component, function(err) {
                    if(err) {
                        console.log(`[Failure] -> The icon couldn't be saved in [${data.outputDir}] because [${err.message}]]`);
                    }
                    else {
                        console.log(`[Successful] -> The icon was saved in [${data.outputDir}] with name [${data.fileName}]`);
                    }         
                }); 
            });
    }
   


    /**
     * Handles the creation of directories.
     * 
     * @param {String} dirPath path
     */
    _dirExistsOrCreate(dirPath) {
        return new Promise((resolve, reject) => {
            mkdirp(dirPath, (err) => {
                if(err) {

                    if(err.code === 'EEXIST') 
                        resolve(`${dirPath} already exists, ommiting...`);
                    else
                        reject(`Could not create ${dirPath} directory: ${err}`);
                }
                else {
                    resolve(`mkdir ${dirPath} successful`);
                }
            });
        });
    }


    /**
     * Downloads the SVG icon from the specified named endpoint
     * 
     * @param {String} url 
     */
    _downloadIcon(url) {

        console.log("Downloading SVG...\n");

        return axios.get(url)
            .then(response => {

                if(response.status != 200) {
                    return response.status;
                }

                return response.data;
            })
            .catch(error => {
                return error.response.status;
            });
    }

    /**
     * Parses the SVG's name to create a download URL compliance with FlatIcon's image endpoint
     * 
     * @param {String} svgName 
     */
    _getdownloadURL(svgName) {

        let id = svgName.substring(svgName.indexOf('_') + 1, svgName.indexOf('_') + 4);
        let fullId = svgName.substring(svgName.indexOf('_') + 1);

        let url =  `https://image.flaticon.com/icons/svg/${id}/${fullId}.svg`;

        console.log(`\nYour download URL is: ${url}\n`);

        return url;
    }
}
