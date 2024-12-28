export type StoreState = Record<PropertyKey, unknown>;

export type Store<State extends StoreState> = {
  state: State;
//   hooks: StoreHook[];
  getState: GetState<State>;
  setState: SetState<State>;
};

export type Stores = Record<PropertyKey, Store<StoreState>>;

export type StoreHook = () => void;

export type CreateStore = (params: {}) => StoreHook;

export type GetState<State extends StoreState> = () => State;

export type SetState<State extends StoreState> = (
  state: State | ((prevState: State) => State),
) => State;
