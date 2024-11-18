import { performActions } from '../../performer.js';
import { getRegistryItemById } from '../../../analyzer/index.js';
import { 
  getRegistryAppItemById,
  setAppItem,
} from '../../../app.js';
import { addItemToResult } from '../../../result/index.js';
import {
  loop,
  loopChildIdList,
  loopChildItems,
} from '../../../util/index.js';

// Reserved actions / keywords of specific types of blocks
export const GET_TAG                = '_get';
export const SET_TAG                = '_set';
export const LIST_TAG               = '_list';
export const NOTHING_TAG            = '_nothing';       // _nothing () - returns nothing item reference
export const START_TAG              = '_start';
export const WRITE_TAG              = '_write';
export const SHOW_TAG               = '_show';
export const CLEAR_TAG              = '_clear';

const MINIMAL = {
  async _clear (details = {}) {},
  async _get (details = {}) {
    let { app, item, result, tree } = details;
    let { data, temp } = item;
    let { childIdList } = data;
    let tag, target;
    
    tag = getRegistryItemById ({ id: childIdList [0], tree });

    // check if the target is remote
    tag.data.tag = tag.data.tag
    if (tag.data.tag.indexOf ('/') === -1) {
      target = app.temp.storage [tag.data.tag];
    }
    else {
      target = app.temp.storage [tag.data.tag];
    }

    addItemToResult ({ app, item: target, result });
    // console.log ('WHAT:', result);
  },
  async _set (details = {}) {
    let { app, item, result, tree } = details;
    let { data, temp } = item;
    let { childIdList } = data;
    let tag, target;
    
    if (childIdList) {
      tag = getRegistryItemById ({ id: childIdList [0], tree });
      target = getRegistryItemById ({ id: childIdList [1], tree });

      // check if the target is remote
      if (tag.data.tag.indexOf ('/') === -1) {
        app.temp.storage [tag.data.tag] = target;
      }
      else {
        app.temp.storage [tag.data.tag] = target;
      }

      // return in the result...
      addItemToResult ({ app, item: target, result });
    }
  },
  async _share (details = {}) {
    let { app, item } = details;
    let parent;
    
    // _set (bob, 32) _share (bob)
    parent = getRegistryAppItemById ({ id: app.data.parentId });
    
    await loopChildItems ({
      app,
      index: 1,     // TODO: Lists should start art 1....
      list: item.data.childIdList,
      async each (details = {}) {
        let { app, item } = details;
        setAppItem ({ item, parent, tag: item.data.tag });
        // console.log ('NICE...');
        // console.log ('*** WHAT:', item.data.tag);
      }
    });
  },
  async _show (details = {}) {
    await loopChildIdList ({
      details,
      async each (details = {}) {
        let { details: nested, id } = details;
        let { item, result, tree } = nested;
        let child;
      
        if (result.temp.text === undefined) {
          result.temp.text = '';
        }
        
        performActions ({ ...nested, id });
        child = tree.data.registry.item [id];
        if (child && child.temp.target) {
          result.temp.text = result.temp.text + child.temp.target;
        } 
      },
    });
  },
  async _start (details = {}) {
    if (details.item.data.isRoot === true) { 
      await loopChildIdList ({
        details,
        async each (details = {}) {
          let { details: nested, id } = details;
          let child;
          await performActions ({ ...nested, id });
        },
      });
    }
  },
  async _write (details = {}) {
    await loopChildIdList ({
      details,
      async each (details = {}) {
        let { details: nested, id } = details;
        let { item, result, tree } = nested;
        let child;
      
        // console.log ('HUH....', result);
        // item.temp.target = '';
        result.temp.text = '';
      
        child = tree.data.registry.item [id];
        if (child) {
          result.temp.text = result.temp.text + child.data.tag;
          // item.temp.target = item.temp.target + child.data.tag;
        }
      },
    });
  },
  _showErrors (details = {}) { },
}

export const BASIC_ACTIONS = {
  ...MINIMAL,
}
