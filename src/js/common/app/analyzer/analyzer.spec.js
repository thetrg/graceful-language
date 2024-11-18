import { expect, specs } from '@thetrg/tm-behave';
import { analyzeActions, print } from './analyzer.js';
import diff from 'microdiff';
import { BACKSLASH_CODE } from '../ascii-code.js';
import {
  CODE_SAMPLE_01,
  CODE_SAMPLE_02,
  CODE_WITH_CONTENT,
  CODE_CASE_INSENSITIVE,
  IGNORE_TAG_ITEM_PAIR_IN_TEXT,
  BREAKOUT_ITEMS_IN_A_LIST,
  BREAKOUT_PAIRED_ITEMS_IN_LIST,
  WRITE_TEXT_THAT_ESCAPES_SPECIAL_CHARACTERS,
  BREAKOUT_MULTIPLE_PAIRED_SIBLING_ITEMS_IN_LIST,
  BREAKOUT_NESTED_MULTIPLE_PAIRED_SIBLING_ITEMS,
} from './analyzer.spec.sample.js';
  
const app = { temp: {} }
  
specs ({
  'test 1': async () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `
      a (item.1, item.2, a.1 (a.1.2, b.1.2 () c.1.2) b.1 ()) b ()
    `.trim () });
    print ({ tree });
    result = diff (tree.data, CODE_SAMPLE_01.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    expect (result.length).is (0);
  },
  'test 2': async () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `
      set (name, text (bob))
    `.trim () });
    result = diff (tree.data, CODE_SAMPLE_02.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'parse with whitespace': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `_write (   this is sample white     space     )`.trim () });
    result = diff (tree.data, CODE_WITH_CONTENT.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'case insensitive': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `Cat (TEST () WHat)`.trim () });
    result = diff (tree.data, CODE_CASE_INSENSITIVE.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'ignore pairing tag and item inside of text': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `_write (age: 32)`.trim () });
    result = diff (tree.data, IGNORE_TAG_ITEM_PAIR_IN_TEXT.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'can break out items in a list': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `_list (a, b, c)`.trim () });
    result = diff (tree.data, BREAKOUT_ITEMS_IN_A_LIST.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'can pair up items in a list': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: `_show (a: 1, b)`.trim () });
    result = diff (tree.data, BREAKOUT_PAIRED_ITEMS_IN_LIST.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'can write text that escapes special characters': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: [
      '_write (test with (escape',
      String.fromCharCode (BACKSLASH_CODE),
      ') characters)',
      '',
    ].join ('').trim () });
    result = diff (tree.data, WRITE_TEXT_THAT_ESCAPES_SPECIAL_CHARACTERS.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'can pair up multiple sibling items in a list': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: 
`set (tree, 
  item (
    info: list ()
    data: b ()
  )
)`.trim () });
    result = diff (tree.data, BREAKOUT_MULTIPLE_PAIRED_SIBLING_ITEMS_IN_LIST.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  'can pair up multiple nested sibling items in a list': () => {
    let result, tree;
    tree = analyzeActions ({ app, text: 
`set (
  info: list (
    version: write (0.1.0)
  )
  data: list (
    buffer: write ()
    c ()
  )
)`.trim () });
    result = diff (tree.data, BREAKOUT_NESTED_MULTIPLE_PAIRED_SIBLING_ITEMS.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    expect (result.length).is (0);
  },
  // 'test 3': null,
  // 'test 4': () => { expect (1).is (2) },
});

/*
set (browser, open browser (headless: false ())))
set (tab, open tab (url: text (https://google.com)))

// BUG: This spec is not running correctly...
specs ([
  async () => {
    let tree;
    tree = parse ({ text: `
      a (item.1, item.2, a.1 (a.1.2, b.1.2 () c.1.2) b.1 ()) b ()
    `.trim () });
    print ({ tree });
    console.log ('done');
    // expect (1).isNot (2);
  },
  // BUG: This spec is not running correctly...
  'parse code', [
    'sample spec 1/2', async () => {
      let tree;
      tree = parse ({ text: `
        a ( a1 () )
      `.trim () });
      print ({ tree });
      console.log ('done');
      // expect (1).isNot (2);
    },
  ],
]);
*/
