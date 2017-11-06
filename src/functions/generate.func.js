import Utils, { 
    LogSeverity,
    log
} from "../utils.js";

import { formatSVG } from "./format.func";


module.exports.generateComponent = (clazz, data) => {
    log(LogSeverity.INFO, 'Creating React-Native component...');

    let reactClass = 
`
import React, { Component } from "react";

import Svg, { ${clazz.imports.join(', ')} } from "react-native-svg";

export default class ${data.className} extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            ${formatSVG(clazz.svg)}
        );
    }
}`;

    log(LogSeverity.INFO, 'React-Native component created...');
    return reactClass;
};