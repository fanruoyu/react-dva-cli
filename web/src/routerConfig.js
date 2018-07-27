import React from 'react';
import { Router, Route } from 'dva/router';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import Cart from './routes/Cart';
import Order from './routes/Order';
import SpecialApply from './routes/SpecialApply';
import SpecialConfirm from './routes/SpecialConfirm';
import QuickOrder from './routes/QuickOrder';
import StandardOrder from './routes/StandardOrder';

// 整体路由配置
function routerConfig({ history }) {
  return (
    <LocaleProvider locale={enUS}>
      <Router history={history}>
        <Route path="/" component={Cart} />
        <Route path="/Cart" component={Cart} />
        <Route path="/StandardOrder" component={StandardOrder} />
        <Route path="/QuickOrder" component={QuickOrder} />
        <Route path="/Order" component={Order} />
        <Route path="/SpecialApply" component={SpecialApply} />
        <Route path="/SpecialConfirm" component={SpecialConfirm} />
      </Router>
    </LocaleProvider>
  );
}

export default routerConfig;
