//import { loopChildIdList } from '../util/index.js';
import { 
  NO_ACTION,
  createItem,
  getRegistryItemById,
} from '../analyzer/index.js';
import {
  _modifyShowItemToWriteTextItems,
} from './modifiers/index.js';
  
export async function modifyActions (details = {}) {
  let { app } = details;
  let { temp } = app;
  let { modifiers, tree } = temp;
  let action, item;
  
  action = modifiers.start;
  if (action) {
    // console.log ('**** dfasdfa', action);
    
    item = app.temp.tree.data.registry.item ['1'];
    if (item) {
      app.data.changeId = app.data.changeId + 1;
      await action ({ app, item });
    }

//    app.data.changeId = app.data.changeId + 1;
//    await modifyNextAction ({
//      app,
//      index: 0,
//      list: app.temp.modifiers,
//    });
  }
  return app;
}

export async function modifyNextAction (details = {}) {
  let { app, index, list } = details;
  let mod;
  mod = list [index];  
  if (mod) {
    details.index = details.index + 1;
    await mod ({ app });
    await modifyNextAction (details);
  }
}

function getAppChangeId (details = {}) {
}

/*
export async function _modifyShowItemToWriteTextItems (details = {}) {
  let { app } = details;
  let { temp } = app;
  let { tree } = temp;
  
  loopItems ({
    app,
    index: 0,
    keys: Object.keys (tree.data.registry.item),
    list: tree.data.registry.item,
    async each ({ app, item }) {
      if (item.data.tag === '_show') {
        await loopChildItems ({
          app,
          index: 0,
          list: item.data.childIdList,
          async each ({ app, item }) {
            if (item.data.tag !== '_write') {
              console.log ('- child:', item.data.tag);
            }
          },
        });
        console.log ('- item:', item.data.tag);
      }
    }
  });
}

export async function loopItems (details = {}) {
  let { app, each, index, keys, list } = details;
  let key, item;
  
  key = keys [index];
  item = list [key];
  if (item) {
    details.index = details.index + 1;
    await each ({ app, item });
    await loopItems (details);
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
*/

export const MINIMAL_MODS = [
  NO_ACTION,
];

export const BASIC_MODS = [
  _modifyShowItemToWriteTextItems,
];

export const MODS = [
  ...MINIMAL_MODS,
  ...BASIC_MODS,
];
