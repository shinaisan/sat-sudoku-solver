import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import TopNavbar from './TopNavbar';
import SolverControl from './SolverControl';

const store = createStore(reducer);

const App = () => {
  return (
    <Provider store={store} >
      <div>
        <TopNavbar />
        <SolverControl />
      </div>
    </Provider>
  );
};

export default App;

