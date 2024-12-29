import { useCallback, useEffect, useState } from "react";

type StoreState = Record<PropertyKey, unknown>;

type SetState<State extends StoreState> = (state: State | ((prevState: State) => State)) => State;

type Trigger = React.Dispatch<React.SetStateAction<number>>

type Subscription = {
    id: number
    priority: number
    trigger: Trigger
}

const createStore = <State extends StoreState>(initialState: State) => {
  let state: State = initialState;

  const setState: SetState<State> = (newState) => (state = typeof newState === "function" ? newState(state) : newState);

  let subscriptionId = 0
  let subscriptions: Subscription[] = []

  const subscribe = (subscription: Subscription) => {
    subscriptions = [...subscriptions, subscription].sort((a, b) => b.priority - a.priority)
  }

  const unsubscribe = (subscription: Subscription) => {
    subscriptions = subscriptions.filter(item => item.id !== subscription.id)
  }

  return function useStore({ priority = 0 }: Partial<{ priority: number }> = {}): [State, SetState<State>] {
    const [_, setCounter] = useState(0)

    useEffect(() => {
        const subscription: Subscription = {
            priority,
            id: subscriptionId++,
            trigger: () => setCounter((v) => v + 1),
        }
        
        subscribe(subscription)

        return () => unsubscribe(subscription)
    }, [priority])
    
    return [state, setState];
  };
};

export default createStore;
