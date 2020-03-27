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

Here's the [diff to add ESLint support](https://github.com/dandv/typescript-modern-project/commit/f816fe6e8d83ce554bd3066ac6638fb4406e917f).
 

# Jest

To fully support Jest with TypeScript and ESLint, we need to:

* `npm install --save-dev jest @types/jest eslint-plugin-jest`
* add `"jest"` to the `types` array in `tsconfig.json`
* add the `'jest'` plugin to `.eslintrc.cjs` and also add `'jest/globals': true` to its `env` key
* create [`jest.config.cjs`](jest.config.cjs)

Now if Jest supported ES Modules, we'd be done, but [it doesn't](https://github.com/facebook/jest/issues/4842), so we'll get this error when running `npm test`:

> SyntaxError: Cannot use import statement outside a module

To work around that, we need to add a `transform` key to `jest.config.cjs` and use Babel to transform the `import` statements from the `.js` files that TypeScript generates:

* `npm install --save-dev @babel/plugin-transform-modules-commonjs`
* create [`babel.config.cjs`](babel.config.cjs)

Normally, to run Jest from `package.json`, we'd add a `"test": "jest"` line. That won't be sufficient, because we need to pass the `--harmony` flag to node (for optional chaining support). 
To pass parameters to Node when running Jest, we'll add the following `test` line:

    "test": "node --harmony node_modules/.bin/jest"

Here's the [diff to add Jest support](https://github.com/dandv/typescript-modern-project/commit/14368e9dadb5f50922ef46fbd9827eaff5334d5f).


# Source maps

If your script generates an error, you'll see the line numbers from the generated `.js` files, which is not helpful. We want to see the original paths and line numbers from the `.ts` files. To do that, we'll add `sourceMap: true` to `tsconfig.json`, install [`source-map-support`](https://www.npmjs.com/package/source-map-support) and run node with the `-r source-map-support/register` parameter. Note that Jest already takes care of source mapping so you'll see the `.ts` line numbers without having to do anything extra.
 
Here's [the diff to add source map support](https://github.com/dandv/typescript-modern-project/commit/4e31278833f2ce07f474d9c6348bb4509082ee97).
