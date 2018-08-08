import React from 'react';
import { Router, Route } from 'dva/router';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
// 路由页面
import App from './routes/App';
import Home from './routes/Home';
import Main from './routes/Main';
import Table from './routes/Table';


// 整体路由配置
function routerConfig({ history }) {
  return (
    <LocaleProvider locale={enUS}>
      <Router history={history}>
        <Route exact path="/" component={App}>
          <Route path="/home" component={Home} />
          <Route path="/main" component={Main}>
            <Route path="/main/table" component={Table} />
          </Route>
        </Route>
      </Router>
    </LocaleProvider>
  );
}

export default routerConfig;
