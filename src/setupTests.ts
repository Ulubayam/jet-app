import "@testing-library/jest-dom";

if (typeof global.TextEncoder === 'undefined') {
  // Disable the no-require-imports rule for this specific require
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
