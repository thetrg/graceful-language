import { NOTHING_ITEM } from '../analyzer/index.js';

export function addItemToResult (details = {}) {
  let { item, result } = details;
  if (item) {
    result.data.item.list.push (item.info.id);
    result.temp.item.list.push (item);
  }
}  

export function createResult (details = {}) {
  let result;
  result = {
    data: {
      status: {
      },
      error: {
        list: [],
      },
      item: {
        tag: {},
        list: [NOTHING_ITEM.info.id],
      },
      registry: {},
    },
    temp: {
      item: {
        tag: {},
        list: [NOTHING_ITEM],
      },
      text: '',
    },
  }
  return result;
}
