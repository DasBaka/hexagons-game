/** Defines the type and characteristics of a hexagon instance, specifying its main function, sub-function, and border status. */
export interface IHexagonInstance {
  main: null | 'tar' | 'player';
  sub: null | 'start' | 'tree';
  border: boolean;
}
