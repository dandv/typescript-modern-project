# Modern TypeScript project template

Minimalistic example of configuring TypeScript and Node to:
* emit modern ES modules code
* import modules that use Node built-ins
* import modules that don't have named exports (e.g. [`apollo-server`](https://github.com/apollographql/apollo-server/issues/1356#issuecomment-565277759), [`node-influx`](https://github.com/node-influx/node-influx/issues/298))
* import your own modules without specifying an extension
* run the resulting JavaScript code

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

Set `"allowSyntheticDefaultImports": true` in `tsconfig.json`. In our code,
instead of `import { InfluxDB } from 'influx` we have to write:

```js
import Influx from 'influx';
const influx = new Influx.InfluxDB();
```

# Import your own modules without specifying an extension

Run Node with the `node --experimental-specifier-resolution=node` parameter:

    node --experimental-specifier-resolution=node run.js
    
Otherwise, [node mandates that you specify the extension](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions) in the `import` statement.

# Run the resulting JavaScript code

Add `"type": "module"` to `package.json`, because [TypeScript can't generate files with the .mjs extension](https://github.com/microsoft/TypeScript/issues/18442#issuecomment-581738714).