import dva from 'dva';
import { message, notification } from 'antd';
import './index.css';
import { authkey } from './utils/Constants.js';

console.log('order---', window.location.hash);
console.log('order---', authkey);
notification.config({
  top: 80,
});
message.config({
  top: 80,
});

// 1. Initialize
const app = dva({
  /* history: browserHistory,*/
  onError(e) { /* Global exception handler scope is dva framework only*/
    // console.error('Uncaught in dva: \n', e);
    if (e.response) {
      const { status, statusText } = e.response;
      if (status == 504) {
        message.error(`Server error ${status}, ${statusText}, please try again later.`);
      }
    }

    if (window.location.port === '8000') {
      message.error(`Uncaught in dva: \n${e}`, 5);
    }
  },
});

window.app = app;

// 2. Plugins
// app.use({});

// 3. Model

app.model(require('./models/cart'));

app.model(require('./models/settlement'));

app.model(require('./models/order'));

app.model(require('./models/specialApply'));

// 4. Router
app.router(require('./routerConfig'));

// 5. Start
app.start('#root');

