'use strict';

var commonOptions = {
  stdout: true,
  failOnError: true
};

module.exports = {
  jscoverage: {
    command: 'jscoverage --no-highlight server server-cov'
  },

  cov: {
    command: {
      name: 'grunt',
      args: 'cov > coverage.html'
    },
    options: commonOptions
  },

  covDebug: {
    command: {
      name: 'grunt',
      args: 'covDebug > coverage.html'
    },
    options: commonOptions
  },

  componentInstallApp: {
    command: {
      name: 'component',
      args: 'install'
    },
    options: commonOptions
  },

  componentBuildApp: {
    command: {
      name: 'component',
      args: 'build -o public/build/dev/client -n build'
    },
    options: commonOptions
  },

  generateShrinkwrap: {
    command: {
      name: 'npm',
      args: 'shrinkwrap'
    },
    options: commonOptions
  }
};