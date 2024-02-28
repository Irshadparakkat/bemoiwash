# Common Function

A Javascript library for common operations.

---------------------------------------

## Modules

There are different type of modules exist in common function library:

#### Modules List:

- [RegExp](regexp/)
- [String](string/)

---------------------------------------

### To add Methods

Procedure to add new methods to the librery:

* Chose the appropiate module to add the new function else create [new module](#to-add-module).
* Create a new file for your method.
* Write your code in the new file.
* Add import and export in index.ts
* Also add it's unit test also

### To add Module

Procedure to add new Module to the librery:

* Create new folder with module name.
* create a new index file inside the folder. you can use other modules index file for reference.
* add new module in index.ts file under the common/functions folder.

---------------------------------------

### Tips to use Module

Tips to use Module from the librery:

##### To import all module and all Functions
```typescript
import CommonFun from '../common/functions';
CommonFun.String.trim(' Test ');
CommonFun.Regexp.escape('e|y-');
```

##### To import single module and its all Functions
```typescript
import String from '../common/functions/string'
String.trim(' Test ')
String.multiReplace('a=b c=d',{a:'b',c:'d'})
```

##### To import single Functions
```typescript
import {trim} from '../../common/functions'
Trim(' Test ')
```