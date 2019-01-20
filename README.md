# React Apollo Hooks

React hooks to integrate with React Apollo

* useApollo
* useQuery
* useMutation

## Install

```
$ yarn add @axelhzf/react-apollo-hooks
```

## Usage

```typescript jsx
import gql from 'graphql-tag';
import { useQuery } from '@axelhzf/react-apollo-hooks';

function Component() {
  const { loading, error, data } = useQuery<PokemonsQuery, PokemonsVariables>({ query });
  if (error) return <div>Error :(</div>;
  if (loading || !data) return <div>Loading...</div>;  
  return (
    <div>
      {data.pokemons.map(pokemon => (
        <div key={pokemon.id}>
          #{pokemon.number} {pokemon.name}
        </div>
      ))}
    </div>    
  ) 
}

const query = gql`
  query Pokemons {
    pokemons {
      id
      number
      name
    }
  } 
`
```

## How to run examples

Clone the repository

```
$ git clone git@github.com:axelhzf/react-apollo-hooks.git
$ cd react-apollo-hooks
```

The examples use a graphql api that you need to run in local

```
$ npx @axelhzf/graphql-pokemon-server
```
 
Now, you can run the examples

```
cd examples/cra-graphql-code-generator
yarn
yarn start
``` 

## License

[MIT License](https://opensource.org/licenses/MIT) © Axel Hernandez Ferrera






