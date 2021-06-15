# Tree


[![Build Status](https://builds.bhi.ma/job/Tree/job/master/badge/icon)](https://builds.bhi.ma/job/Tree/)
[![Coverage Status](https://coveralls.io/repos/github/IMA-WorldHealth/Tree/badge.svg?branch=master)](https://coveralls.io/github/IMA-WorldHealth/Tree?branch=master)

This module provides a simple API to create trees from [adjacency lists](https://en.wikipedia.org/wiki/Adjacency_list).
Specifically, given an array of JSON objects with ids and pointers to their parent ids, we can construct a tree
structure and furnish operations on that structure.

## Example
```js
/**
 *  This tree looks like this:
 *            ROOT
 *         /    |    \
 *       id:1  id:4  id:6
 *       /           /   \
 *    id:2          id:7   id:3
 *     /
 *   id:5
 */
const nodes = [{
  id : 1,
  parent : 0,
}, {
  id : 2,
  parent : 1,
}, {
  id : 3,
  parent : 6,
  valueA : 10,
  valueB : 2,
}, {
  id : 4,
  parent : 0,
  valueA : 30,
  valueB : 4,
}, {
  id : 5,
  parent : 2,
  valueA : 9,
  valueB : 7,
}, {
  id : 6,
  parent : 0,
}, {
  id : 7,
  parent : 6,
  valueA : 10,
  valueB : 19,
}];

const tree = new Tree(nodes);

tree.walk((node) => console.log('node.id:', node.id));
// => 1, 2, 5, 4, 6, 7, 3
```

## API
The API is simple but powerful.  Most operations on trees can be defined as recursive functions, where a property of a
node is either determined by a parent property or an aggregation of the child properties.  For example, the depth of 
node `N` is simply the depth of `N`'s parent plus 1.  Similarly, to compute a sum on the parent nodes, simply update
the parent node's value for every child in the tree.

The following API functions are supported:

### walk(fn, callFnBeforeRecurse = true)
Walks the tree in order and applies `fn()` either before or after the recursive (descent) step.  The `fn` function can
take in two properties 

### find(id)
Finds a node in the tree by its id.

### sort(fn)
Sorts the tree in place using the comparison function `fn`.  The `fn` function is internally passed to
[Array.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

## Common Functions
To keep operations simple, the library expects you to use `walk()` for the majority of your operations.  However,
common `walk()` functions are exposed through the `Tree.common` object.  These are documented below:

### computeNodeDepth
Sets the `depth` all nodes as a function of their parents depths property.  The root node is `depth = 0` and subsequent
levels are `childNode.depth = parentNode.depth + 1`.

Usage:
```js
const tree = new Tree(nodes);
tree.walk(Tree.common.computeNodeDepth);
// each node now has node.depth set on it!
const node = tree.find(12);
console.log('depth is:', node.depth);
```

### sumOnProperty(property, defaultValue = 0)
Aggregates the value of parent nodes as a function of their children.  For example, if a parent has two children with
values `3` and `5`, the parent's value will be `8`.

Usage:
```js
// an adjency tree of one parent, two children
const nodes = [
  { id: 1, value: null },
  { id: 2, value: 3, parent : 1 },
  { id: 3, value: 10, parent : 1 },
];

const tree = new Tree(nodes);
tree.walk(Tree.common.sumOnProperty('value'));

const node2 = tree.find(2);
console.log(node.value); //  => 3
const node1 = tree.find(1);
console.log(node.value); // => 13
```

## License
MIT
