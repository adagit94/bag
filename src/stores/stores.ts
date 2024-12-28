import ReactDOM from "react-dom";
import React from "react";
import { Store, Stores, StoreState } from "./StoresTypes";

let stores: Stores = {};
let storeId = 0;

const useStore = () => {};

const createStore = <State extends StoreState>(initialState: State) => {
  const id = storeId++;
  let store: Store<State> =  {
    state: initialState,
    getState: () => store.state,
    setState: (state) => (store.state = typeof state === "function" ? state(store.state) : state),
  };

  stores[id] = store as Store<StoreState>
};

export default createStore;
