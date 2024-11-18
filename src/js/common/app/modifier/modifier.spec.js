import { expect, specs } from '@thetrg/tm-behave';
import diff from 'microdiff';
import { analyzeActions } from '../analyzer/index.js';
import { loopChildItems, loopItems } from '../util/index.js';
import { modifyActions } from './modifier.js';
import { 
  createApp, 
  setAppModifierStart,
} from '../app.js';
import { 
  addToRegistry,
  createItem,
  getRegistryItemById,
} from '../analyzer/index.js';

specs ({
  'modify an action to it\'s core action alias': async () => {
    let app, result, log, start, tree, write;
    
    app = createApp ();
    setAppModifierStart ({ 
      app, 
      start: replaceAliasActions,
    });
    
    result = await analyzeActions ({ app, text: `log (write (hi))`.trim () });
    result = await modifyActions ({ app });
    
    tree = app.temp.tree.data.registry.item;
    log = tree [2];
    write = tree [3];
    
    expect (log.data.tag).is ('_log');
    // expect (write.data.tag).is ('_write');
    
    console.log (log, write);
  },
});

async function replaceAliasActions (details = {}) {
  await loopItems ({
    details,
    async each (details = {}) {
      let { app, index, item } = details;
      let { temp } = app;
      let { tree } = temp;
      let child, id, parent, parentId;
    
      if (item.data.tag === 'log') {
        item.data.old = item.data.tag;
        item.data.tag = '_log';
      }
      else if (item.data.tag === 'write') {
        item.data.old = item.data.tag;
        item.data.tag = '_write';
      }
    
      /*
      if (item.data.childIdList) {
        await loopItems ({ details: { ...details }, item });
      }
      */
    },
  });
}



/*
child = createItem ({ isAction: true, text: '_log', tree });
//        console.log ('TEST:', item.data.tag, child);

id = child.info.id;
parentId = item.data.parentId
child.data.parentId = parentId;

parent = getRegistryItemById ({ id: parentId, tree });
if (parent) {
  child.data.level = parent.data.level + 1;
  child.data.childIdList = [0, item.info.id];

  if (!parent.data.childIdList) {
    parent.data.childIdList = [0];
  }

  parent.data.childIdList [index] = id;
}

addToRegistry ({ item: child, tree });

console.log ('TEST:', index, child);
console.log ('TEST:', tree.data.registry);
*/
