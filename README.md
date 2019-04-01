# vscode-js-add-function README

This is a test version of my javascript add function extension.

## Features

Select the function you want to add whether as method which is invoked in object context or as an unbound function.

```
var obj = {
    foo: function() {
        this.bar()   
    }
    bar: function() {
    // do your stuff
    }
};
```

```
function foo() {
    bar()
}

function bar() {
    // do your stuff
}
```

## Requirements

Don't know yet

## Known Issues

Methods in object context are not add with the correct white spacxe to do your stuff.
