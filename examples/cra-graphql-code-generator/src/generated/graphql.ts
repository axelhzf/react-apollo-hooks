export type Maybe<T> = T | null;

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;

// ====================================================
// Documents
// ====================================================

export type PokemonByNameVariables = {
  name: string;
};

export type PokemonByNameQuery = {
  __typename?: 'Query';

  pokemonByName: Maybe<PokemonByNamePokemonByName>;
};

export type PokemonByNamePokemonByName = {
  __typename?: 'Pokemon';

  id: string;

  name: string;

  image: string;

  types: string[];

  number: number;

  evolutions: PokemonByNameEvolutions[];
};

export type PokemonByNameEvolutions = PokemonCardFieldsFragment;

export type PokemonsVariables = {};

export type PokemonsQuery = {
  __typename?: 'Query';

  pokemons: PokemonsPokemons[];
};

export type PokemonsPokemons = PokemonCardFieldsFragment;

export type PokemonCardFieldsFragment = {
  __typename?: 'Pokemon';

  id: string;

  name: string;

  number: number;

  image: string;
};
