// Import without specifying the extension. `./Lib.js` would look odd in a .ts file
import { Lib } from './Lib';

test('constructor', () => {
  const instance = new Lib();
  expect(instance instanceof Lib).toBeTruthy();
});
