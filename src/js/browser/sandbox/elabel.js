import { start as startOs } from '~/env/sandbox/os/elabel/start.js';

export async function start () {
  document.addEventListener ('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
    }
  });
  
  startOs ();
}