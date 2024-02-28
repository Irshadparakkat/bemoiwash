# String Modules

A Javascript library Module for String operations.

---------------------------------------

## Method

There are different type of method exist in String Modules:

### Method List:

- [trim()](#trim)
- [ltrim()](#ltrim)
- [rtrim()](#rtrim)
- [multiReplace()](#multiReplace)
- [slugify()](#slugify)

---------------------------------------

### trim()

Function for Strip whitespace (or other characters) from the beginning and end of a string.
* @param {String} strInput - Input string.
Eg: "***The way forward*"
* @param {String} strMask - (Optional) You can also specify the characters you want to strip.
Eg: "*"
* @return {String} - Returns the modified string.
Eg: "The way forward"

```typescript
trim('**The way forward','*') // "The way forward"
```

---------------------------------------

### ltrim()

Function for Strip whitespace (or other characters) from the beginning of a string.
* @param {String} strInput - Input string.
Eg: "***The way forward*"
* @param {String} strMask - (Optional) You can also specify the characters
you want to strip.
Eg: "*"
* @return {String} - Returns the modified string.
Eg: "The way forward*"

```typescript
ltrim('**The way forward*','*') // "The way forward*"
```

---------------------------------------

### rtrim()

Function for Strip whitespace (or other characters) from the end of a string
* @param {String} strInput - Input string.
Eg: "*The way forward**"
* @param {String} strMask - (Optional) You can also specify the characters
* you want to strip.
Eg: "*"
* @return {String} - Returns the modified string.
Eg: "*The way forward"

```typescript
rtrim('*The way forward**','*') // "*The way forward"
```

---------------------------------------

### multiReplace()

Function for replacing multiple words at a time in a string.
* @param {String} strInput - Input string.
Eg: "I have a cat and a dog"
* @param {Object} arrMatched - Array for replace value.
Eg: { cat: 'Car', dog: 'Bike' }
* @return {String} - Replaced string.
Eg: "I have a Car and a Bike"

```typescript
multiReplace('I have a cat and a dog',{cat:'Car', dog:'Bike'}) // "I have a Car and a Bike"
```

---------------------------------------

### slugify()

Function for generate slugify string of a string.
* @param {String} strInput - Input string.
Eg: "🐶*x*the way 4wrd* x"
* @param {Typecast} chrTypecast - (Optional) U for Upper case, L for Lower case and null for no change.
Eg: "U"
* @param {String} strReplace - (Optional) replace spaces with replacement.
Eg: "_"
* @return {String} - Returns the modified string.
Eg: "___X_THE_WAY_4WRD__X"

```typescript
slugify('🐶*x*the way 4wrd* x','U','_') // "___X_THE_WAY_4WRD__X"
```