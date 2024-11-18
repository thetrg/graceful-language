import {
  LINE_FEED_CODE,
  CARRIAGE_RETURN_CODE,
  SPACE_CODE,
  OPEN_PARENTHESIS_CODE,
  CLOSE_PARENTHESIS_CODE,
  COMMA_CODE,
  COLON_CODE,
  BACKSLASH_CODE,
  NEWLINE_LIST,
} from '../ascii-code.js';
import {
  generateId,
  randomNumber,
} from '../util/index.js';

function addItem (details = {}) {
  let { tree } = details;
  let { data } = tree;
  let current, id, item, parent;
  
  // show (bob, setdf (), )  
  item = createItem ({ text: data.buffer, tree });
  if (item) {    
    clearBuffer ({ tree });

    current = getRegistryItemById ({ id: tree.data.item.currentId, tree });

    // console.log ('BOB:', item.data.tag);
    if (item.data.level === current.data.level) {
      addItemChild ({ child: item, parentId: current.info.id, tree });
    }
    else {
      // if (item.data.tag === 'data') { 
        // console.log ('*** HERE ***', item.data.tag, current.data.tag); 
        // console.log ('*** HERE ***', item.data.level, current.data.level);
        parent = findFirstAncestorItem ({ level: item.data.level, item: current, tree });
        // console.log ('*** HERE ***', parent.data.tag, parent.data.level);
        if (parent) {
          addItemChild ({ child: item, parentId: parent.info.id, tree });
        }
      // }
    }

    // console.log ('- item level:', item.data.level, current.data.level);
    addToRegistry ({ item, tree });
    
    if (tree.data.scan.current === COLON_CODE) {
      item.data.paired = true;
      tree.data.level = tree.data.level + 1;
      tree.data.item.currentId = item.info.id;


    //  tree.data.item.nextItemParentId = item.info.id;
    }
  }
}

export function addToRegistry (details = {}) {
  let { current, item, tree } = details;
  let id;
  
  if (item.data.tag) {
    id = item.info.id;
    tree.data.registry.item [id] = item;

    if (current === true) {
      tree.data.item.currentId = id;
    }
  }
}

export function analyzeActions (details = {}) {
  let { app, text = '' } = details;
  let tree;
  
  tree = createTree ();
  if (app) {
    app.temp.tree = tree;
  }
  scanText ({ parentId: tree.data.rootId, text, tree });
  clearBuffer ({ tree });
  
  return tree;
}

function closeItemBlock (details = {}) {
  let { tree } = details;
  let { data } = tree;
  let current, id, item, parent, text;
  
  current = getRegistryItemById ({ id: tree.data.item.currentId, tree });
  
  if (data.buffer.length) {
    text = data.buffer.trim ();
    if (text) {
      item = createItem ({ text: data.buffer, tree });
      if (tree.data.mode === SCAN_TEXT_MODE) {
        item.data.isText = true;
      }
      clearBuffer ({ tree });

      if (current.data.level === item.data.level) {
        addItemChild ({ child: item, parentId: current.info.id, tree });
      }
      else if (current.data.level > item.data.level) {
        addItemChild ({ child: item, parentId: current.data.parentId, tree });
      }

      addToRegistry ({ item, tree });
      // console.log ('- level:', current.data.level, item.data.level, item.data.tag);
    }    
  }
  else {
    parent = getRegistryItemById ({ id: current.data.parentId, tree });
    /*
    if (parent && parent.data.paired && current.data.tag === 'list') { 
      // console.log ('*****', current.data.parentId); 
      //tree.data.level = tree.data.level - 1;
      //parent = findFirstAncestorItem ({ level: current.data.level, item: current, tree });
      
      // tree.data.item.currentId = parent.info.id;
      // tree.data.item.nextItemParentId = parent.info.id;
    }
    */
  }
  
  tree.data.level = tree.data.level - 1;
  // console.log ('- close:', current.data.tag, current.data.level, tree.data.level);
}

function openItemBlock (details = {}) {
  let { tree } = details;
  let { data } = tree;
  let current, id, item, parent;
  
  tree.data.level = tree.data.level + 1;
  
  item = createItem ({ isAction: true, text: data.buffer, tree });
  if (item && item.data.tag === '_write') {
    tree.data.mode = SCAN_TEXT_MODE;
  }
  
  clearBuffer ({ tree });
  
  if (item === undefined) { return }
  
  // Determine how the child item should be attached
  current = getRegistryItemById ({ id: tree.data.item.currentId, tree });
  
  if (item.data.level === current.data.level) {
    addItemChild ({ child: item, parentId: current.data.parentId, tree });
  }
  else if (item.data.level > current.data.level) {
    addItemChild ({ child: item, parentId: current.info.id, tree });
  }
  else if (item.data.level < current.data.level) {
    parent = findFirstAncestorItem ({ level: item.data.level, item: current, tree });
    if (parent) {
      addItemChild ({ child: item, parentId: parent.info.id, tree });
    }
  }
  
  // console.log ('- level:', item.data.level, current.data.level, item.data.tag);
  
  addToRegistry ({ current: true, item, tree });
}

function findFirstAncestorItem (details = {}) {
  let { level, item, tree } = details;
  let count, id, max, target;
  
  count = 0;
  max = 1000;
  
  target = item;
  while (id !== 0) {
    if (target) {
      target = getRegistryItemById ({ id: target.data.parentId, tree });
      if (target && target.data.level < level) {
        // console.log ('- level not found');
        // target = getRegistryItemById ({ id: target.data.parentId, tree });
        return target;
      }
      // console.log ('trace', level, target.info.id);
    }
    
    count = count + 1;
    if (count > max) { break; }
  }
}

function scanText (details = {}) {
  let { parentId = 0, text, tree } = details;
  let { data } = tree;
  let { scan } = data;
  let char, code, end, i, item, list, mode;
  
  list = text;
  end = list.length;
  
  for (i = 0; i < end; i++) {    
    code = list.charCodeAt (i);
    char = list [i];
    
    // scan the characters
    scan.previous = scan.current;
    scan.current = code;
    if (i < (end - 1)) {
      scan.next = list.charCodeAt (i + 1);
    }
    else {
      scan.next = 0;
    }
    
    if (NEWLINE_LIST.indexOf (scan.current) > -1) {
      // console.log ('COOL');
      tree.data.line = tree.data.line + 1;
    }
    
    // console.log ('- scan:', i, char, code);
    mode = tree.data.mode;
    if (mode === SCAN_MODE) {
      if (code === OPEN_PARENTHESIS_CODE && scan.previous !== BACKSLASH_CODE) {
        openItemBlock (details);
      }
      else if (code === CLOSE_PARENTHESIS_CODE && scan.previous !== BACKSLASH_CODE) {
        closeItemBlock (details);
      }
      else if ((code === COMMA_CODE || code === COLON_CODE) && scan.previous !== BACKSLASH_CODE) {
        addItem (details);
      }
      else {
        data.buffer = data.buffer + char;
      }
    }
    else if (mode === SCAN_TEXT_MODE) {
      if (code === CLOSE_PARENTHESIS_CODE && scan.previous !== BACKSLASH_CODE) {
        closeItemBlock (details);
        tree.data.mode = SCAN_MODE;
      }
      else {
        data.buffer = data.buffer + char;
      }
    }
  }
}

// ------------------------------------------------------
// Abstract Syntax Tree (AST)

const NOTHING_TAG = '_nothing';
const START_TAG = '_start';
  
function addItemChild (details = {}) {
  let { child, parent, parentId, tree } = details;
  let current, id, paired;
  
//  if (child.data.tag === 'list') {
//    console.log ('**** bdf', parentId);
//  }
  
  if (tree.data.item.nextItemParentId > 0) {
    paired = true;
    parentId = tree.data.item.nextItemParentId;
    tree.data.item.nextItemParentId = 0;
  }
  
  if (child && child.data.tag) {
    id = child.info.id;
    child.data.parentId = parentId;

    if (parent === undefined) {
      parent = getRegistryItemById ({ id: parentId, tree });
    }
    
    if (parent) {
      child.data.level = parent.data.level + 1;
      
      if (!parent.data.childIdList) {
        parent.data.childIdList = [0];
      }
      parent.data.childIdList.push (id);

      if (paired === true) {
        parent.data.paired = true;
      }
    }
  }
}

function clearBuffer (details = {}) {
  let { tree } = details;
  tree.data.buffer = '';
}

export function getRegistryItemById (details = {}) {
  let { id, tree } = details;
  let item;
  item = tree.data.registry.item [id];
  return item;
}

export function print (details = {}) {
  let { tree } = details;
  let dom;
  dom = document.querySelector ('.ast.preview');
  if (dom) {
    dom.textContent = JSON.stringify (tree, null, 2);
  }
  // getCodeInfo ();
}

const SCAN_MODE = 'scan';
const SCAN_TEXT_MODE = 'scan text';

function createTree (details = {}) {
  let id, item, tree;
  id = generateId ();
  tree = {
    info: {
      id,
      version: '0.1.0',
    },
    data: {
      buffer: '',
      item: {
        currentId: null,
        nextItemParentId: 0,
      },
      level: 0,
      line: 1,
      mode: SCAN_MODE,
      registry: {
        item: {},
        total: 1,
      },
      rootId: null,
      scan: {
        current: 0,
        next: 0,
        previous: 0,
      },
    },
    temp: {},
  }
  
  // item = NOTHING_ITEM;
  tree.data.registry.item [NOTHING_ITEM.info.id] = NOTHING_ITEM;
  
  item = createItem ({ isAction: true, text: START_TAG, tree });
  item.data.isRoot = true;
  tree.data.rootId = item.info.id;
  
  item.data.parentId = 0;
  tree.data.registry.item [item.info.id] = item;
  tree.data.item.currentId = item.info.id;
  
  return tree;
}

// ------------------------------------------------------
// Item

export function createItem (details = {}) {
  let { id = 0, isAction, level = 0, tag, text = '', tree } = details;
  let item, line;

  line = 1;
  if (text) {
    // id = generateId (details);
    id = generateId ({ registry: tree.data.registry });
    
    if (tree.data.mode === SCAN_TEXT_MODE) {
      tag = text;
    }
    else {
      tag = text.trim ().toLowerCase ();
    }
    
    level = tree.data.level;
    line = tree.data.line;
  }

  if (tag) {
    item = {
      info: {
        id,
        version: '0.1.0',
        changeId: 0,
      },
      data: {
        childIdList: null,
        level,
        line,
        parentId: null,
        tag,
        // text,
      },
      temp: {
      },
    }
    
    if (isAction === true) { item.data.isAction = true; }
  }
  
  return item;
}

function getItemId (details = {}) {
  let { item } = details;
  if (item) { return item.info.id; }
  return 0;
}

// ------------------------------------------------------
// Misc

export const NO_ACTION = async () => {}
export const NOTHING_ITEM = createItem ({ id: 0, tag: NOTHING_TAG });
