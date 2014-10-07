# git-format

`git-format` allows you to parse the output of the `git log --pretty=format:""`
command. There's some data outputted by git which simply cannot be parsed
without manually injecting separators. Things the commit body and user names can
contain all the things, ranging from dashes to comma's. This module attempts to
solve this issue by pre-processing your format, injecting separators and then
parse the output to JSON document.

## Installation

Install this module through the node package manager (npm):

```
npm install --save git-format
```

## Usage

In all examples we assume that the code is load as following:

```js
'use strict';

var parser = require('git-format');
```

The `parser` variable is now a function which parses you output. It requires
2 arguments:

1. A line of the output that needs to be parsed.
2. The format that was used to generate the output.

```js
parse(line, '%cE %h %s %an');
```

If you've received multiple lines you can simply split the output and map it:

```js
lines.split(/\n/g).map(function map(line) {
  return parse(line, format);
});
```

### parser.reformat

As you might have read in the introduction text, we need to pre-process the
format so we can inject the placeholders. We expose the `.reformat` method on
the parser for that. It accepts the format you want to parse as first argument
and returns the reformatted format.

```js
var format = parser.reformat("%H %s");
```

### parser.extract

There are cases where you might just receive the full git command from somewhat
and need to extract the format in order to reformat it. We've added an `.extract`
method on the parser for that.

```js
var command = 'git log --pretty=format"%H"'
  , format = parser.extract(command);

command = command.replace(format, parser.reformat(format));
```

## License

MIT
