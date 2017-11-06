
import fs from "fs";
import axios from "axios";
import mkdirp from "mkdirp";
import Utils, { 
    getDefaultName,
    getClassName,
    LogSeverity,
    log
} from "../utils.js";

import { generateComponent } from "../functions/generate.func";
import { parseSVG } from "../functions/parse.func";

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
            .then((svg) => {
                return parseSVG(svg);
            })
            .then((clazz) => {
                return generateComponent(clazz, data);
            })
            .then((component) => {
               return this._saveComponent(component, data);
            })
            .catch((err) => {
                log(LogSeverity.ERROR, err.message);
                log(LogSeverity.INFO, `\n\n[if you believe this is a mistake please open an issue @ https://github.com/AlburIvan/react-native-svg-search/issues]`);
              
            });
    }


    /**
     * This method is in charge of saving the component in the specified output directory,
     * if the directory doesn't exists it will create a new one.
     * 
     * @param {ReactClass} component 
     * @param {Array} data
     */
    _saveComponent(component, data) {
       
        log(LogSeverity.INFO, `Saving new component on ${data.outputDir}`);

        this._dirExistsOrCreate(data.outputDir)
            .then((message) => {

                let path = `${data.outputDir}/${data.fileName}`

                fs.writeFile(path, component, function(err) {
                    if(err) {
                        log(LogSeverity.ERROR, `The icon couldn't be saved in [${data.outputDir}] because [${err.message}]]`);
                    }
                    else {
                        log(LogSeverity.SUCCESS, `The icon was saved in [${data.outputDir}] with name [${data.fileName}]`);
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

        log(LogSeverity.INFO, `Downloading SVG...`);

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

        log(LogSeverity.INFO, `Your download URL is: ${url}`);
        return url;
    }
}
