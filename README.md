# Modern TypeScript project template

Minimalistic example of configuring TypeScript and Node to:
* emit modern ES modules code
* import modules that use Node built-ins
* import modules that don't have named exports (e.g. [`apollo-server`](https://github.com/apollographql/apollo-server/issues/1356#issuecomment-565277759), [`node-influx`](https://github.com/node-influx/node-influx/issues/298))
* import your own modules without specifying an extension
* run the resulting JavaScript code

There is no need for Babel.

# Emit ES modules code

In `tsconfig.json`, set this in `compilerOptions`:

```json
    "target": "esnext",
    "module": "esnext",  // Output `import`/`export` ES modules
```


# Import modules that use Node built-ins (`http`, `url` etc.)

* run `npm install --save-dev @types/node`
* in `tsconfig.json` under `compilerOptions`, set
  * `"moduleResolution": "node"`, so `tsc` can find modules [when targeting ES6+](https://github.com/Microsoft/TypeScript/issues/8189) 
  * `"types": ["node"]` to avoid errors related to Node built-in modules  


# Import modules that don't have named exports

Normally we could write in TypeScript

    import { InfluxDB } from 'influx';

but when generating ES modules code, that statement will be passed through as is, and will cause Node to fail with

> SyntaxError: The requested module 'influx' does not provide an export named 'InfluxDB'

because [`node-influx` doesn't provide named exports](https://github.com/node-influx/node-influx/issues/298) (and neither does an even more popular module, [`apollo-server`](https://github.com/apollographql/apollo-server/issues/1356#issuecomment-565277759)).

One alternative would be to generate old ugly commonjs modules code by,

* removing the `"type": "module"` line from `package.json`, and
* changing the module line to `"module": "CommonJS"` in `tsconfig.json` (`allowSyntheticDefaultImports` also becomes unnecessary)

Another is to import the entire module:

```js
import Influx from 'influx';
const influx = new Influx.InfluxDB();
```

However, this will generate `Error TS1192: Module '...' has no default export.` To prevent that, set `"allowSyntheticDefaultImports": true` in `tsconfig.json`.


# Import your own modules without specifying an extension

When transpiling, [TypeScript won't generate an extension for you](https://github.com/microsoft/TypeScript/issues/16577). Run Node with the `node --experimental-specifier-resolution=node` parameter:

    node --experimental-specifier-resolution=node run.js
    
Otherwise, [node mandates that you specify the extension](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions) in the `import` statement.

To support optional chaining, add the `--harmony` flag to the node command line.


# Run the resulting JavaScript code

Add `"type": "module"` to `package.json`, because [TypeScript can't generate files with the .mjs extension](https://github.com/microsoft/TypeScript/issues/18442#issuecomment-581738714).


# ESLint

To be able to run `eslint`, we must create an `.eslintrc.cjs` file, rather than a `.js` one (due to `"type": "module"` in `package.json`). Then, install the required dependencies:

    npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
