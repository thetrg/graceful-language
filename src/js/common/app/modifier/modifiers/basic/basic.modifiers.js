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
              // console.log ('- child:', item.data.tag);
            }
          },
        });
        // console.log ('- item:', item.data.tag);
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

//  item = list [index];
//  if (item) {
//    details.index = details.index + 1;
//    
//    item = getRegistryItemById ({ id: item, tree: app.temp.tree });
//    await each ({ item });
//    await loopChildItems (details);
//  }
}
