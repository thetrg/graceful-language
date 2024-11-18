import {
  getRegistryItemById,
} from '../analyzer/index.js';
import {
  NUMBER_0_CODE,
  NUMBER_9_CODE,
} from '../ascii-code.js';

export function generateId (details = {}) {
  let { registry } = details;
  let id;
  if (registry) {
    id = registry.total;
    registry.total = registry.total + 1;
  }
  else {
    id = [Date.now (), (randomNumber () + '').padStart (4, '0')].join ('-');
  }
  return id;
}

export function randomNumber (details = {}) {
  // ref: https://stackoverflow.com/a/7228322
  let { min = 0, max = 9999 } = details;
  return Math.floor (Math.random () * (max - min + 1) + min);
}

export async function loop (details = {}) {
  let { list } = details;
  if (list && list.length) {
    if (details.index === undefined) { details.index = 0; };
    let { details: nested, each, index } = details;
    let item;
    
    item = list [index];
    details.index = details.index + 1;
    if (item && each) {
      await each ({
        item,
        details: nested,
      });
    }
    
    if (details.index < list.length) {
      await loop (details);
    }
  }
}

export async function loopChildIdList (details = {}) {
  let { details: passedDetails, each: passedEach } = details;
  await loop ({
    details: passedDetails,
    async each (details = {}) {
      let { details: nested, item } = details;
      await passedEach ({ 
        details: nested,
        id: item,
      });
    },
    list: passedDetails.item.data.childIdList,
  });
}

export async function loopChildItems (details = {}) {
  let { app, each, index = 1, list } = details;
  let item;
  
  if (list && list.length) {
    item = list [index];
    if (item) {
      details.index = details.index + 1;

      item = getRegistryItemById ({ id: item, tree: app.temp.tree });
      await each ({ app, index, item });
      await loopChildItems (details);
    }
  }
}

export async function loopItems (details = {}) {
  let { details: nested, each } = details;
  let { app, item } = nested;
  await loopChildItems ({
    app,
    list: item.data.childIdList,
    each,
  });
}

function printJson (target) {
  console.log (JSON.stringify (target, null, 2));
}

globalThis.printJson = printJson;

export async function analyzeQueryString (details = {}) {
  let { query = '' } = details;
  let list, result;
  result = {};
  if (query.indexOf ('?') === 0) {
    list = query.split ('?') [1];
    list = list.split ('&');
    list.forEach ((item) => {
      let parts, tag, value;
      parts = item.split ('=');
      tag = parts [0];
      value = parts [1].trim ();
      
      if (value.toLowerCase () === 'true') {
        value = true;
      }
      else if (value.toLowerCase () === 'false') {
        value = false;
      }
      else if (
        (value.charCodeAt (0) >= NUMBER_0_CODE)
        && (value.charCodeAt (0) <= NUMBER_9_CODE)) {
        value = parseInt (value);
      }
      
      result [tag] = value;
    });
  }
  return result;
}
