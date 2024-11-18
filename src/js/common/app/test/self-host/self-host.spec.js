import { expect, specs } from '@thetrg/tm-behave';
import diff from 'microdiff';
import { 
  createApp,
  runActions,
  setAppActions,
  setParent,
} from '../../app.js';
import {
  getRegistryItemById,
} from '../../analyzer/index.js';
import { getStorage } from '~/env/index.js';
import getValue from 'get-value';
//import { loopChildIdList } from '../../util/index.js';

specs ({
  'contains a tree of the results': async () => {
    let app, result, tree;
    app = createApp ();
    setAppActions ({ actions: ACTIONS, app });
    result = await runActions ({ app, text: LANGUAGE_SPEC_SECTION_01 });
    // console.log (app.temp.tree);
    // printJson (app);
  },
});

const LANGUAGE_SPEC_SECTION_01 = `
get (graceful/language/common/0.1.0/action.grc, bob)
`.trim ();

const COMMON = {
  async get (details = {}) {
    let { app, item, tree } = details;
    // console.log (details);
    let appChild, content, id, list, options, path, storage, tag;
  
    options = {
      separator: '/',
    }
    
    list = item.data.childIdList;
    if (list && list.length) {
      id = list [1];
      path = getRegistryItemById ({ id, tree });
      if (path) {
        tag = path.data.tag;
        if (tag.indexOf ('/') > 0) {
          storage = await getStorage ();
          content = getValue (storage.data, tag, options, {});
          // console.log (path.data.tag, '---', content);

          appChild = createApp ();
          setParent ({ parent: app, child: appChild });
          
          await runActions ({ app: appChild, text: content });
          // console.log ('- storage:', Object.keys (appChild.temp.storage));
          
          /*
          if (shared.count < shared.max) {
            await runActions ({ app, reset: false, text: '' });
            console.log ('- storage:', app.temp.storage);
          }
          else {
            console.error ('max loops reached.');
          }
          // printJson (app.temp.tree);
          */
        }
        else {
        }
        
        await loopChildItems ({
          app,
          index: 1,
          list,
          async each (details = {}) {
            let { item } = details;
            let storage;
          
            // console.log ('WHAT', item.data.tag);
//            storage = app.temp.storage;
//            console.log (app.temp.storage, tag);
//            if (app.temp.storage [tag]) {
//              console.log ('- child:', item.data.tag);
//            }
//            else {
//              console.error ('dfadfasdf');
//            }
          }
        });
      }
    }
  }
}

const ACTIONS = {
  ...COMMON,
  _showErrors (details = {}) {
    let { result } = details;
    let content;
    
    content = [];
    result.data.error.list.forEach ((error) => {
      content.push (error);
      console.error (error);
    });
  }
}

export async function loopChildItems (details = {}) {
  let { app, each, index, list } = details;
  let item;

  item = list [index];
  if (item) {
    details.index = details.index + 1;
    
    item = getRegistryItemById ({ id: item, tree: app.temp.tree });
    await each ({ item });
    await loopChildItems (details);
  }
}
