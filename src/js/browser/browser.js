import { analyzeQueryString } from '../common/app/util/index.js';
import '@fontsource-variable/inconsolata';
import './index.less';

export async function start () {
  let mod, query, target;
  
  query = await analyzeQueryString ({ query: location.search });
  // console.log (query);
  
  if (query.app === 'editor') {
    target = './sandbox/editor.js';
  }
  else if (query.app === 'todo') {
    target = './sandbox/todo.js';
  }
  else if (query.app === 'elabel') {
    target = './sandbox/elabel.js';
  }
  else if (query.app === 'bsg') {
    target = './sandbox/bsg.js';
    mod = await import ('./sandbox/bsg.js');
    mod.start ();
  }
  
  /*
  if (target) {
    // HACK: Work around to vite issue - https://github.com/vitejs/vite/issues/14102
//    setTimeout (async () => {
      let mod;
      mod = await import (target);
      if (mod.start) {
        mod.start ();
      }
//    }, 1);
  }
  */
}
