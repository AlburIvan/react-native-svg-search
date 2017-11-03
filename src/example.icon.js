
// TODO: dynamic imports
/*
import Svg,{
   $imports
} from 'react-native-svg';
*/

/*
paso 1:
    devolver el xml con todos los tags en mayuscula
    por cada elemento que le vaya a remplazar la mayuscula, toma el elemento hasta el siguiente espacio
    y eso agregalo a un array de imports

*/


/*
<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<Svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
<Polygon style="fill:#EFCE4A;" points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798
        10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
</svg>
*/

// "export class $className extends Component"

export class SVGExample /* extends Component */ {
/*
    render() {
        return (
            <Svg
                height="100"
                width="100"
                viewBox="0 0 53.867 53.867">
                <Polygon 
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </Svg>
        );
    }
*/
}


/*
import Svg,{
   $imports
} from 'react-native-svg';

export class $className extends Component {

    render() {
        return(
            $svg
        );
    }
}
*/