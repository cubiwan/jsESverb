# jsESverb
Library to conjugate verbs in spanish

To do that library I have use code from [https://github.com/voldmar/conjugation](https://github.com/voldmar/conjugation)

## Load

```html
<script src="jsESverbsIrregular.js" charset="UTF-8"></script> //List of irregular forms of verbs
<script src="jsESverbList.js" charset="UTF-8"></script> //List of all infinitives
<script src="jsESverb.js" charset="UTF-8"></script> 
```
```js
var verb = new jsESverb();
```

## Example

```js
var verb = new jsESverb();
var result1 = verb.conjugate(word);
var result2 = verb.isVerb(word);
```

## Interface

```js
conjugate(word);
```
Return all forms of one verb

_word_: verb in infinitive

```js	
stemText(word, showFalses);
```
Return array of posibles form of the verb, each array have 4 items:

0. conjugation (ar,er,ir)
1. tense
2. infinitive
3. in list (true if infinitive is in the list of jsESverbList.js, false if isn't)

_word_: verb to find the form

_showFalses_: true if returns item with 'in list' false.

## Demo

[Here](https://cubiwan.github.io/jsESverb/index.html)
