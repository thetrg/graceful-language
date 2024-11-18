import { expect, specs } from '@thetrg/tm-behave';
import diff from 'microdiff';
import { createApp } from '../../../app.js';
import { analyzeActions } from '../../../analyzer/index.js';
import { performActions } from '../../../performer/index.js';

//const shared = {
//  app: createApp (),
//}

specs ({
  'modify `show ()` to wrap non `write ()` actions in a `write ()` action': async () => {
    let app, result;
    
    app = createApp ();
    await analyzeActions ({ app, text: `_show (_set (age, 32))`.trim () });
    result = await performActions ({ app });
//    console.log ('WHAT:', result);
//    expect (result.temp.text).is ('hi');
//    _show (
//      _write (some value)
//      _set (age, 32)
//    )
  },
});
