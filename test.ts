// Import without specifying the extension. `./Lib.js` would look odd in a .ts file
import { Lib } from './Lib';

test('constructor', () => {
  const instance = new Lib();
  expect(instance instanceof Lib).toBeTruthy();
});

try {
  throw new Error('testing source mapping in Jest');
} catch (e) {
  if (e.stack.includes('.ts:')) {
    console.info('Stack trace mapped back to TypeScript should indicate correct error line number');
    console.info(e);
  }
}
