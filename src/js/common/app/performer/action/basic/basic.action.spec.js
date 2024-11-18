import { expect, specs } from '@thetrg/tm-behave';
import diff from 'microdiff';
import { BASIC_ACTIONS } from './basic.action.js';
import { performActions } from '../../performer.js';
import { analyzeActions } from '../../../analyzer/index.js';

specs ({
  'use show to print to console': async () => {
    let result;
    await analyzeActions ({ app, text: `_show (_write (hi))`.trim () });
    result = await performActions ({ app });
    expect (result.temp.text).is ('hi');
  },
  'can set a value in the storage': async () => {
    let result;
    await analyzeActions ({ app, text: `_set (age, 32) _set (age, 43)`.trim () });
    result = await performActions ({ app });
    // console.log ('WHAT:', result);
    // expect (result.temp.text).is ('hi');
  },
  'use show to print to return values to console': async () => {
    /*
    let result;
    await analyzeActions ({ app, text: `_show (_set (age, 32))`.trim () });
    result = await performActions ({ app });
    expect (result.temp.text).is ('hi');
    */

    // TODO: Get failures to show up in console display
    // tree = analyzeActions ({ app, text: `_show (_write (hi))`.trim () });
    // result = diff (tree.data, BREAKOUT_PAIRED_ITEMS_IN_LIST.data);
    // console.log (JSON.stringify (tree, null, 2));
    // console.log (result);
    // print ({ tree });
    // expect (result.length).is (0);
  },
});

const shared = {
  history: [],
}

const app = { 
  temp: {
    actions: {
      ...BASIC_ACTIONS,
      async _show (details = {}) {
        let { result } = details;
        await BASIC_ACTIONS._show (details);
        shared.history.push (result.temp.text);
      },
    },
    storage: {},
  }, 
}

const CODE_SHOW_HI_TREE = {
  "info": {
    "id": "1730832682600-2018",
    "version": "0.1.0"
  },
  "data": {
    "buffer": "",
    "item": {
      "currentId": 3,
      "nextItemParentId": 0
    },
    "level": 0,
    "mode": "scan",
    "registry": {
      "item": {
        "0": {
          "info": {
            "id": 0,
            "version": "0.1.0",
            "changeId": 0
          },
          "data": {
            "childIdList": null,
            "level": 0,
            "parentId": null,
            "tag": "_nothing"
          },
          "temp": {}
        },
        "1": {
          "info": {
            "id": 1,
            "version": "0.1.0",
            "changeId": 0
          },
          "data": {
            "childIdList": [
              2
            ],
            "level": 0,
            "parentId": 0,
            "tag": "_start",
            "isAction": true,
            "isRoot": true
          },
          "temp": {}
        },
        "2": {
          "info": {
            "id": 2,
            "version": "0.1.0",
            "changeId": 0
          },
          "data": {
            "childIdList": [
              3
            ],
            "level": 1,
            "parentId": 1,
            "tag": "_show",
            "isAction": true
          },
          "temp": {}
        },
        "3": {
          "info": {
            "id": 3,
            "version": "0.1.0",
            "changeId": 0
          },
          "data": {
            "childIdList": [
              4
            ],
            "level": 2,
            "parentId": 2,
            "tag": "_write",
            "isAction": true
          },
          "temp": {}
        },
        "4": {
          "info": {
            "id": 4,
            "version": "0.1.0",
            "changeId": 0
          },
          "data": {
            "childIdList": null,
            "level": 2,
            "parentId": 3,
            "tag": "hi",
            "isText": true
          },
          "temp": {}
        }
      },
      "total": 5
    },
    "rootId": 1,
    "scan": {
      "current": 41,
      "next": 0,
      "previous": 41
    }
  },
  "temp": {}
}


/*




*/

