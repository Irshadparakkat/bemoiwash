# Regexp Modules

A Javascript library Module for regular expression operations.

---------------------------------------

## Method

There are different type of method exist in Regexp Modules:

### Method List:

- [escape()](#escape)

---------------------------------------

### escape()

Function for escaping regular expression string.
* @param {String} strInput - Input string.
Eg: "e|y-"
* @return {String} - Replaced string.
Eg: "e\|y\-"

```typescript
escape('e|y-') // "e\|y\-"
```