import { CodeJar } from 'codejar';
import { 
  BASIC_ACTIONS, 
  createApp, 
  runActions,
  setAppActions,
} from '~/common/app/index.js';
import { 
  expect, 
  runSpecs,
} from '@thetrg/tm-behave';
import '../index.spec.js';
// import 'codejar-linenumbers/codejar-linenumbers.css';
//import { withLineNumbers } from "codejar-linenumbers";

import SandboxGrcCode from '~/env/graceful/sandbox/start.grc?raw';
import { getActions } from '~/env/graceful/sandbox/sandbox.action.js';
  
//function createApp () {}
//function setAppActions () {}
//function getCode () {}
//function runActions () {}
//const BASIC_ACTIONS = {}

export async function start (details = {}) {
  await createEditor (details);
}

function getCode () { return ''; }

export async function createEditor (details = {}) {
  let { code = '' } = details;
  let app, dom, editor, jar, options, parent;
  
  app = createApp ();
  
  parent = document.querySelector ('#app');
  
  dom = document.createElement ('div');
  dom.className = 'code area';
  parent.appendChild (dom);
  parent = dom;
  
  dom = document.createElement ('div');
  editor = dom;
  editor.app = app;
  setupActions ({ app });
  
  dom.className = 'code editor';
  parent.append (dom);
  
  dom.addEventListener ('keydown', () => { highlight (editor); });
  dom.addEventListener ('keyup', () => { highlight (editor); });
  dom.addEventListener ('click', () => { highlight (editor); });
  
  options = {
    tab: ' '.repeat (2),
    indentOn: /\($/,
  }
  
  code = SandboxGrcCode;
  // console.log (SandboxGrcCode);
  jar = CodeJar (dom, highlight, options);
//  jar = CodeJar (dom, withLineNumbers (highlight), options);
  jar.updateCode (getCode (code));
  
  dom = document.createElement ('div');
  dom.className = 'code info';
  parent.append (dom);
  
  dom = document.createElement ('div');
  dom.className = 'console display';
  parent.append (dom);
  
  // AST Explorer
  parent = document.querySelector ('#app');
  
  dom = document.createElement ('div');
  dom.className = 'ast preview';
  parent.append (dom);
  
  getCodeInfo ();
  
  document.addEventListener ('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
    }
  });
  
  // focus on the editor.
  setTimeout (async () => {
    editor.focus ();
  }, 10)
}

function showStats (details = {}) {
  let { name, stats } = details;
  let html;
  html = '';
  if (stats [name] > 0) {
    html = [
      '<span class="specs ' + name + ' stats">',
      name + '[', 
        stats [name],
      ']</span>',
      '',
    ].join ('');
  }
  return html;     
}

function getCodeInfo (details = {}) {
  let { runner } = details;
  let column, dom, editor, row, stats;
  
  column = 0;
  row = 0;
  editor = document.querySelector ('.code.editor');
  dom = document.querySelector ('.code.info');
  if (dom && editor) {
    stats = '';
    if (runner) {
      stats = runner.data.stats;
      stats = [
        '<div class="specs area">',
          'specs:',
          showStats ({ name: 'time', stats }),
          showStats ({ name: 'total', stats }),
          showStats ({ name: 'fail', stats }),
          showStats ({ name: 'pass', stats }),
          showStats ({ name: 'todo', stats }),
        '</div>',
        '',
      ].join ('');
    }
    
    column = getCaretPosition ({ dom: editor });
    //dom.textContent = [
    dom.innerHTML = [
      '<div class="text info area">',
        'line: ' + (row + 1), 
        ' - column: ' + (column + 1), 
      '</div>',
      stats,
      '',
    ].join ('');
  }
}

function showRunnerErrors (details = {}) {
  let { runner } = details;
  let { data } = runner;
  let { error } = data;
  let dom, html;
  
  if (runner.stats.fail) {
    dom = document.querySelector ('.console.display');
    
    html = [];
    error.list.forEach ((entry) => {
      html.push (
        '<div class="error entry">',
          entry,
        '</div>',
        ''
      );
    });
    
    dom.innerHTML = html.join ('');
  }
}

function preview (details = {}) {
  let { dom, tree } = details;
  let json;
  dom = document.querySelector ('.ast.preview');
  if (dom) {
    json = JSON.stringify (tree, null, 2);
    // console.log ('DFADF', tree, json);
    dom.textContent = json;
  }
}

function renderHtml () {
}

function setupActions (details = {}) {
  let { app } = details;
  let dom;
  
  dom = document.querySelector ('.console.display');
  if (dom) {
    dom.innerHTML = '';
  }

  setAppActions ({
    app,
    actions: {
      ...BASIC_ACTIONS,
      async _clear (details = {}) {
        console.clear ();
        document.querySelector ('.code.editor').innerHTML = '';
        document.querySelector ('.console.display').innerHTML = '';
        document.querySelector ('.ast.preview').innerHTML = '';
    
        // _clear(all), _clear(code) _clear(display) _clear(ast)
        console.log ('- TODO: Have _clear command with `_clear(all)` to clear');
      },
      async _show (details = {}) {
        let { result } = details;
        let dom, html;
        await BASIC_ACTIONS._show (details);

        dom = document.querySelector ('.console.display');
        if (dom) {
          html = [];  
          if (result.temp.text) {
            html.push (result.temp.text);
          }

          if (result.data.error.list.length) {
            dom.innerHTML = dom.innerHTML + '<div>' + html.join ('\n') + '</div>';
          }
          else {
            dom.innerHTML = '<div>' + html.join ('\n') + '</div>';
          }
        }
      },
      _showErrors (details) {
        let { result } = details;
        let dom, html;

        dom = document.querySelector ('.console.display');
        if (dom) {
          html = [];

          if (result.data.error.list.length) {
            result.data.error.list.forEach ((error) => {
              // console.error (error);
              html.push (['<div class="console error">ERROR: ', error, '</div>'].join (''));
            });
          }

          dom.innerHTML = html.join ('\n');
        }
      },
      ...getActions (),
    },
  });
}

function highlight (editor) {
  let dom, position, runner, text, tree;
  let { app } = editor;
  text = editor.textContent;
  
  try {
    runActions ({
      app,
      async before () {
        let dom = document.querySelector ('.console.display');
        if (dom) {
          dom.innerHTML = '';
        }
                
        runner = await runSpecs ();
        showRunnerErrors ({ runner });   

        // stats = runner.data.stats;
        // console.log ('- results:', stats);
        // console.log (`- time(ms): [${stats.time}]   start: [${stats.start}] end: [${stats.end}]`);
      },
      after (details = {}) {
        let { app } = details;
        preview ({ ...details, dom, tree: app.temp.tree });
        getCodeInfo ({ runner });
      },
      text,
    });
  }
  catch (err) {
    console.error (err);
  }
}

function getCaretPosition ({ dom }) {
  // ref: https://phuoc.ng/collection/html-dom/get-or-set-the-cursor-position-in-a-content-editable-element/
  // ref: https://stackoverflow.com/a/23699875
  // https://stackoverflow.com/a/3976125
  
  let clonedRange, position, range, selection;
  selection = window.getSelection && window.getSelection ();
  
  position = 0;
  if (selection && selection.rangeCount > 0) {
    range = selection.getRangeAt (0);
    clonedRange = range.cloneRange ();
    clonedRange.selectNodeContents (dom);
    clonedRange.setEnd (range.endContainer, range.endOffset);
    position = clonedRange.toString ().length;
  }

  return position;
}
