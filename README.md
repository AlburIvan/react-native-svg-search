## react-native-svg-cli
This CLI is a helper to include an icon from FlatIcon and ouputs the react-native compatible SVG component in your desired directory.


#### Table of Contents

* [Installation](#installation)
* [How to Use](#how-to-use)
* [License](#license)


## Installation

```
$ npm install react-native-svg-cli
```


## How to Use


1. Open https://www.flaticon.com/
2. Search for your desired icon and click on it
3. On the search bar look for the icon's FQN:  https://www.flaticon.com/free-icon/github-social-logo_9310
4. Copy that name (github-social-logo_9310) and and then run the cli with either option below:
```
$ rn-svg-cli search -n name -f filename -o outputDir
```
Note: Flags can be ommited, but order should be respected:  
 ```$ rn-svg-cli search <name> <filename> <output>```

OR
```
$ rn-svg-cli search
```

With the later, you will be asked the next questions:  
  
* Whats the name of the Icon (Ex. **github-social-logo_9310**): 
* What name should the new file have (we will append .icon.js):  
* Where should we save the new file (default assets/icons):  
  


![][cli-demo]


## License

	Copyright 2017 AlburIvan
	
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
	   http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.



[cli-demo]: https://gif
