export class Lib {
  run(): void {
    // Make sure optional chaining works - either by `tsc` transpiling it, or by node running it under a flag
    const a = {
      b: {
        c: 'foo'
      }
    };
    a.b?.c && console.log('Own module imported successfully');
  }
}
