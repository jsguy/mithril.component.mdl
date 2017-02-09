**DEPRECATION NOTICE**

Don't use this, it is deprecated/no longer supported or updated, instead use this:

https://github.com/ArthurClemens/polythene

Why you ask? Well, the library that this is based on is now in "limited support" mode:

https://github.com/google/material-design-lite

Also, there is an issue with how that library injects components into the DOM:

https://github.com/google/material-design-lite/issues/1732

Which unfortunately means syncronising the DOM and the vDOM is night on impossible in certain situations.

# mithril MDL components

This creates [http://www.getmdl.io/](MDL) components for use with mithril.

Use state to create different components, for example:

```javascript
m.components.mButton({text: "Hello"})
```

Is a "normal" coloured button, whereas this:

```javascript
m.components.mButton({state: {fab: true, colored: true}, text: "add"})
```

Is a "fab" (round) button with a plus symbol

For further options, see [the MDL documentation](http://www.getmdl.io/components/index.html)
