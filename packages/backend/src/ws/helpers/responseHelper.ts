interface Event<TEventName extends string = string, TData extends any = any> {
  event: TEventName
  data?: TData
}

const event = <TEventName extends string = string, TData extends any = any>(
  eventName: TEventName,
  data?: TData
): Event<TEventName, TData> => ({
  event: eventName,
  data,
})

export { event, Event }
