/* eslint-disable @typescript-eslint/no-require-imports */
const React = require('react');

module.exports = {
  ClerkProvider: ({ children }) => React.createElement('div', null, children),
  SignedIn: ({ children }) => React.createElement('div', null, children),
  SignedOut: ({ children }) => React.createElement('div', null, children),
  UserButton: () => React.createElement('div', null, 'UserButton'),
};
