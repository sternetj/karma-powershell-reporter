# karma-powershell-reporter

## Installation
The easiest way is to keep `karma-powershell-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "^1.0.0",
    "karma-powershell-reporter": "^1.0.0"
  }
}
```

You can simple do it by:

    $ npm install karma-powershell-reporter --save-dev

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    // reporters configuration
    reporters: ['powershell']
  });
};
```

## Options
The `karma-powershell-reporter` leverages the reporting capabilities of `karma-mocha-reporter`. Any config option available to the `karma-mocha-reporter` is also available to the `karma-powershell-reporter` with the exception of the ability to control specific colors. The config values can be found at the [chalk](https://github.com/litixsoft/karma-mocha-reporter#karma-mocha-reporter) github repo.

The config values are set as such:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    // reporters configuration
    reporters: ['powershell'],

    // reporter options
    powershellReporter: {
      // mocha reporter config options
    }
  });
};
```
