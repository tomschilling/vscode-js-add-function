# vscode-js-add-function README

How good is adding a new function? 
Even better when you can easily add your already written function to your file.

## Installing

Extension is available for free in the Visual Studio Code Marketplace.

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

![object method](gif/objectMethod.gif)


```
function foo() {
    bar()
}

function bar() {
    // do your stuff
}
```

![unbound function](gif/function.gif)


##Usage

1. Highlight a written function
2. Press Cmd+Shift+A
3. The function will be added at and of object or file


## Known Issues

Methods in object context are not added with the correct white space. You have to tab to do your stuff.
