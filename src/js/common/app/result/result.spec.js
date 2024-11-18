import { expect, specs } from '@thetrg/tm-behave';
import diff from 'microdiff';
import { analyzeActions } from '../analyzer/index.js';
import { performActions } from '../performer/index.js';

specs ({
  'contains a tree of the results': async () => {
    let result, tree;
    tree = await analyzeActions ({ app: shared.app, text: `_show (_write (some value), _set (num1, 10)`.trim () });
    result = await performActions ({ app: shared.app });
    // printJson (tree);
    // printJson (result);
  },
});

const shared = {
  app: {
    temp: {
      actions: {},
      tree: {},
    },
  }
}

/*
_show: {
  - 4 - _write: {}
  -  - _set: {}
}

action (average num, ()
  
)

set (averagenum, action (n1, n2, n3, n4

))

*/
