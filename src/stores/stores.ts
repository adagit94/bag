export type StoreState = Record<PropertyKey, unknown>;

export type SetState<State extends StoreState> = (
  state: State | ((prevState: State) => State),
) => State;

const createStore = <State extends StoreState>(initialState: State) => {
  let state: State = initialState;

  const setState: SetState<State> = (newState) => (state = typeof newState === "function" ? newState(state) : newState),

  return (): [State, SetState<State>] => {
    return [state, setState]
  };
};

export default createStore;
