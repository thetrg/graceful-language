import { 
  analyzeActions, 
  print,
} from './analyzer/index.js';
import { 
  MODS,
  modifyActions,
} from './modifier/index.js';
import { 
  BASIC_ACTIONS, 
  performActions,
} from './performer/index.js';
import {
  generateId,
} from './util/index.js';
import { createResult } from './result/index.js';

const shared = {
  registry: {
    item: {},
    total: 0,
  },
}

export function createApp (details = {}) {
  let app;
  app = {
    info: {
      id: generateId ({ registry: shared.registry }),
    },
    data: {
      changeId: 0,
      name: 'Un-named App',
    },
    temp: {
      actions: BASIC_ACTIONS,
      modifiers: {
        list: [...MODS],
        start: null,
      },
      storage: {},
    },
  }
  shared.registry.item [app.info.id] = app;
  
  app.toJSON = toJson;  
  return app;
}

export function getAppActions (details = {}) {
  let { app } = details;
  let { temp } = app;
  return temp.actions;
}

export function getAppTree (details = {}) {
  let { app } = details;
  let { temp } = app;
  return temp.tree;
}

export function setAppModifierStart (details = {}) {
  let { app, start } = details;
  let { temp } = app;
  temp.modifiers.start = start;
}

export function getRegistryAppItemById (details = {}) {
  let { id } = details;
  return shared.registry.item [id];
}

export async function runActions (details = {}) {
  let { after, app, before, replace, text } = details;
  let { temp } = app;
  let { actions } = temp;
  let result;
  
  try {
    if (before) {
      await before ({ app });
    }
    
    // Handle the action changes to the app
    await analyzeActions ({ app, text });
    await modifyActions ({ app, replace });
    result = await performActions ({ app, replace });

    if (after) {
      await after ({ app });
    }
  }
  catch (err) {
    if (actions._showErrors) {
      result = createResult ();
      result.data.error.list.push (err.message);
      result.data.error.list.push (err.stack);
      actions._showErrors ({ result });
    }
    else {
      console.error (err);
    }
  }
}

export function setAppActions (details = {}) {
  let { actions = {}, app } = details;
  app.temp.actions = {
    ...app.temp.actions,
    ...actions,
  }
}
  
export function setAppItem (details = {}) {
  let { item, parent, tag } = details;
  // console.log ('CRUD:', tag, parent);
  // TODO: Add permissions on this 
  if (parent.temp.storage [tag] === undefined) {
    parent.temp.storage [tag] = item;
  }
  else {
    console.error (`Unable to set app item. An item already exists with the tag [${tag}]`);
  }
}
  
function toJson () {
  let result;
  result = { ...this };
  delete result.temp;
  return result;
}

export function setParent (details = {}) {
  let { child, parent } = details;
  
  child.data.parentId = parent.info.id;
  if (parent.data.childIdList === undefined) {
    parent.data.childIdList = [0];
  }
  parent.data.childIdList.push (child.info.id);
  // console.log ('set parent:', child, parent);
}


