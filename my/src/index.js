import dva from 'dva';
import { message, notification } from 'antd';
import './index.css';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import {notifyError} from './services/app';

notification.config({
  top: 80,
});
message.config({
  top: 80,
});

// 1. Initialize
const app = dva({
  /* history: browserHistory,*/
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError(e) { /* Global exception handler scope is dva framework only*/
    // console.error('Uncaught in dva: \n', e);
    if (e.response) {
      const { status, statusText } = e.response;
      if (status === 504) {
        message.error(`Server error ${status}, ${statusText}, please try again later.`, 2);
      }
    }

    if (window.location.port === '9090') {
      message.error(`Uncaught in dva: \n${e}`, 2);
    }
  },
});

window.app = app;

// 2. Plugins
// app.use({});

// 3. Model

// app.model(require('./models/cart'));
app.model(require('./models/home'));

// 4. Router
app.router(require('./routerConfig'));

// 5. Start
app.start('#root');

