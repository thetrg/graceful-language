import { 
  BASIC_ACTIONS, 
  createApp, 
  runActions,
  setAppActions,
} from '../common/index.js';
  
export async function start (details = {}) {
  let app;
  app = createApp ();
  setAppActions ({
    app,
    actions: {
      _showErrors (details) {
        let { result } = details;
        let list;
        
        list = [];
        if (result.data.error.list.length) {
          result.data.error.list.forEach ((error) => {
            console.error ('ERROR:', error);
          });
        }
      },
    },
  });
  runActions ({ app, text: 'log (write(hello world))' });
}
