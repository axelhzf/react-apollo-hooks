import React from 'react';
import './App.css';
import { ApolloHooksProvider } from '@axelhzf/react-apollo-hooks';
import ApolloClient from 'apollo-boost';
import styled from 'styled-components/macro';
import { Pokemons } from './Pokemons';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Pokemon } from './Pokemon';
import { createGlobalStyle } from 'styled-components';

const client = new ApolloClient({
  uri: 'http://localhost:4000'
});

function App() {
  return (
    <ApolloHooksProvider client={client}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path="/" exact={true} component={Pokemons} />
          <Route path="/:name" exact={true} component={Pokemon} />
        </Switch>
      </Router>
    </ApolloHooksProvider>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    background: #F5FAFC;
  } 
  a {
    text-decoration: none;
  }
`;

const fixStyledComponenetMacroLoad = styled.div``;

export default App;
