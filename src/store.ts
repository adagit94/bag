import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

type StoreState = Record<PropertyKey, unknown>;

type Subscription = {
  id: number;
  priority: number;
  trigger: () => void;
};

type SetState<State extends StoreState> = (stateUpdate: Partial<State> | ((prevState: State) => Partial<State>)) => State;
type InitState<State extends StoreState> = (get: () => State, set: SetState<State>) => State;

const createStore = <State extends StoreState>(initState: State | InitState<State>) => {
  let state: State =
    typeof initState === "function"
      ? initState(
          () => state,
          (stateUpdate) => setState(stateUpdate)
        )
      : initState;

  let subscriptionId = 0;
  let subscriptions: Subscription[] = [];

  const setState: SetState<State> = (stateUpdate) => {
    state = { ...state, ...(typeof stateUpdate === "function" ? stateUpdate(state) : stateUpdate) };

    for (const subscription of subscriptions) {
      flushSync(subscription.trigger);
    }

    return state;
  };

  const subscribe = (subscription: Subscription) => {
    subscriptions = [...subscriptions, subscription].sort((a, b) => b.priority - a.priority);
  };

  const unsubscribe = (subscription: Subscription) => {
    subscriptions = subscriptions.filter((item) => item.id !== subscription.id);
  };

  return function useStore({ priority = 0 }: Partial<{ priority: number }> = {}): [State, SetState<State>] {
    const [_, setCounter] = useState(0);

    useEffect(() => {
      const subscription: Subscription = {
        priority,
        id: subscriptionId++,
        trigger: () => setCounter((v) => v + 1),
      };

      subscribe(subscription);

      return () => unsubscribe(subscription);
    }, [priority]);

    return [state, setState];
  };
};

export default createStore;
