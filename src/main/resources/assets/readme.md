### Local Development
* Node.js

``` bash
#Install JSX compiler
npm init -y
install babel-cli@6 babel-preset-react-app@3

#Run the compiler
npx babel --watch src --out-dir scripts --presets react-app/prod
```