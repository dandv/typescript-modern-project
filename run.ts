// Import without specifying the extension. `./Lib.js` would look odd in a .ts file
import { Lib } from './Lib';

// Can't use named imports because https://github.com/node-influx/node-influx/issues/298
// import { InfluxDB } from 'influx';
// const influx = new InfluxDB();

import Influx from 'influx';
const influx = new Influx.InfluxDB();
if (influx instanceof Influx.InfluxDB)
  console.info('Module without named exports imported successfully');

const l = new Lib();
l.run();

try {
  throw new Error('testing source mapping');
} catch (e) {
  if (e.stack.includes('.ts:')) {
    console.info('Stack trace mapped back to TypeScript should indicate correct error line number');
    console.info(e);
  }
}
