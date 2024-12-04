import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from '../reducers';

const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

let enhancer;

if (__DEV__) {
  enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, navMiddleware));
} else {
  enhancer = compose(applyMiddleware(thunkMiddleware, navMiddleware));
}

// const enhancer = compose(applyMiddleware(thunkMiddleware, navMiddleware));

function configureStore(initialState) {
  const store = createStore(reducer, initialState, enhancer);
  return store;
}

export default configureStore();
