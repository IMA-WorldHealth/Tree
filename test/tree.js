const test = require('ava');
const Tree = require('..');

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

let tree;

test.beforeEach(() => {
  tree = new Tree(nodes);
});

const isObj = o => typeof o === 'object';
const isArr = Array.isArray;
const isUndef = u => u === undefined;

test('#constructor() should populate private variables', t => {
  t.true(isObj(tree._rootNode));
  t.true(isArr(tree._rootNode.children));
});

test('#constructor() the root node should have three childen', t => {
  const node = tree._rootNode;
  t.true(node.children.length === 3);
});

test('#walk() should be called for every node in the tree', t => {
  const size = nodes.length;
  let counter = 0;
  tree.walk(() => counter++);
  t.true(counter === size);
});

test('#walk() should visit every node in the tree', t => {
  tree.walk(node => { node.visited = tree; });
  const dump = tree.toArray();
  const everyNodeVisited = dump.every(node => node.visited);
  t.true(everyNodeVisited);
});

test('#find() should find node with id 4', t => {
  const node4 = tree.find(4);

  t.true(node4.id === 4);
  t.true(node4.valueA === 30);
  t.true(node4.valueB === 4);
  t.true(node4.children.length === 0);
});

test('#find() node id:6 should have two children', t => {
  const node6 = tree.find(6);
  t.true(node6.id === 6);
  t.true(node6.children.length === 2);
});

test('#toArray() should return an array', t => {
  const array = tree.toArray();
  t.true(isArr(array));
  t.true(array.length === nodes.length);
});

test('#constructor() tree should have a maximum depth of 3', t => {
  tree.walk(Tree.common.computeNodeDepth);
  let max = 0;
  tree.walk(node => { max = Math.max(max, node.depth); });
  t.true(max === 3);
});

test('#walk() should be able to compute the balances of nodes', t => {
  const node1 = tree.find(1);
  const node4 = tree.find(4);
  const node6 = tree.find(6);

  // first level should not be defined
  t.true(isUndef(node1.valueA));
  t.true(isUndef(node1.valueB));

  // this is a level 1 leaf node, so its values are known.
  t.true(node4.valueA === 30);
  t.true(node4.valueB === 4);

  tree.walk(Tree.common.sumOnProperty('valueA'), false);

  t.true(node1.valueA === 9);
  t.true(isUndef(node1.valueB));

  t.true(node4.valueA === 30);
  t.true(node4.valueB === 4);

  // this condition sums multiple leaves
  tree.walk(Tree.common.sumOnProperty('valueB'), false);
  t.true(node1.valueB === 7);

  t.true(node4.valueA === 30);
  t.true(node4.valueB === 4);

  t.true(node6.valueA === 20);
  t.true(node6.valueB === 21);
});
