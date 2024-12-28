type CreateStoreParams = {}
export type StoreHook = () => void
export type CreateStore = (params: CreateStoreParams) => StoreHook

export type GetState<T = unknown> = () => T
export type SetState<T = unknown> = (s: T) => T

export type Store<T = unknown> = {
    state: T
    getState: GetState
    setState: SetState
}

export type Stores = Record<PropertyKey, Store>