
import  * as fs from "fs";
import * as axios from "axios";

export default class FlatIconParser {

    constructor() {}

    getReactIcon(answers) {
        this._getdownloadURL(answers.svg);
    }

    getReactIcon(svgName, shouldGenerateName) {
        
        let url = this._getdownloadURL(svgName);
        let iconXml = this._downloadIcon(url);

        iconXml.then((resp) => {

            if(resp === 500) {
                console.log("SERVER");
                return;
            }

            if(resp === 404) {
                console.log("NOT FOUND");
                return;
            }

            let svgXml = resp.replace(/<g>(\r\n|\r|\n)<\/g>/g, '');
            console.log(`${svgXml}`);
        });
     
    }
   
    // TODO: create a method to download the icon and then change all elements to react-native-svg elements
    _dirExistsOrCreate(dirPath) {
        fs.mkdir(dirPath, (err) => {
            if(err) {
                console.log(`Could not create ${dirPath} directory: ${err}`);
            }
            else {
                console.log(`mkdir ${dirPath} successful`);
            }
        });
    }
   

    _downloadIcon(url) {
        return axios.get(url)
            .then(response => {

                if(response.status == 404) {
                    console.log("NOT FOUND");
                    return undefined;
                }

                return response.data;
            })
            .catch(error => {
                return error.response.status;
            });
    }

    _getdownloadURL(svgName) {

        let url = "https://image.flaticon.com/icons/svg/$id/$fullId.svg"; 

        let id = svgName.substring(svgName.indexOf('_') + 1, 8);
        let fullId = svgName.substring(svgName.indexOf('_') + 1);

        url = url.replace("$id", id).replace("$fullId", fullId);

        console.log(`URL: ${url}`);

        return url;
    }
}