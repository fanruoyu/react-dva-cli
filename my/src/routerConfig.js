import React from 'react';
import { Router, Route } from 'dva/router';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import Home from './routes/Home';

// 整体路由配置
function routerConfig({ history }) {
  return (
    <LocaleProvider locale={enUS}>
      <Router history={history}>
        <Route path="/" component={Home} />
        <Route path="/Cart" component={Home} />
      </Router>
    </LocaleProvider>
  );
}

export default routerConfig;
