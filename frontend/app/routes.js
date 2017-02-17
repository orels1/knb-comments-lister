/**
 * Created by antonorlov on 17/02/2017.
 */
// Polyfill
import 'whatwg-fetch';

import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

// You can read more here: https://github.com/reactjs/react-router

export default (
    <Route component={App}>
        <Route path="/" component={Home} />
    </Route>
);