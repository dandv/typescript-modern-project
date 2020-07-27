module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*.test.ts',  // test filenames matching this regex
  moduleFileExtensions: ['ts', 'js'],  // modules are only in .ts files, but 'js' *must* be specified too
};
