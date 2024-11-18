import { createResult } from '../result/index.js';
import {
  getAppActions,
  getAppTree,
} from '../app.js';
import {
  loopChildIdList,
} from '../util/index.js';

export async function performActions (details = {}) {
  let { actions, app, id = 1, replace, result = createResult () } = details;
  let action, item, tree;
  
  if (actions === undefined) {
    actions = getAppActions (details);
    if (replace && replace.actions) {
      actions = {
        ...replace,
        ...replace.actions,
      }
    }
  }
  
  tree = getAppTree (details);
  item = tree.data.registry.item [id];
  
  if (item) {
    if (item.data.isAction === true) {
      action = actions [item.data.tag];
      if (action) {
        await action ({ actions, app, item, result, tree });
      }
      else {
        result.data.error.list.push (
          'Undefined action "' 
          + item.data.tag + ' ()"'
          + ' on line ' + item.data.line
        );
        if (actions && actions._showErrors) {
          actions._showErrors ({ result, tree });
        }
      }
    }
    else if (item.data.childIdList && item.data.childIdList.length > 1) {
      // console.log (item.data.tag, item.data);
      
      await loopChildIdList ({
        details: { app, item },
        async each (details = {}) {
          let { details: nested, id } = details;
          let { item } = nested;
          // console.log (item.data);
          await performActions ({ ...nested, id });
        },
      });
    }
  }
  return result;
}
