import {alert} from "./index";

export class Alert {
  constructor(public message: string) {}
}

export const addTimedAlert = (_alert: Alert, ms: number) => {
  alert.value = _alert;

  return setTimeout(() => alert.value = null, ms);
}

export const addAlert = (_alert: Alert) => {
  alert.value = _alert;
}
