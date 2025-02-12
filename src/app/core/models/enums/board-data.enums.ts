/** Defines the color scheme for different types of hexagons on the game board, including basic, center, starter, tree, border, and development hexagons. */
export enum EHexColor {
  Basic = 'transparent',
  Center = 'gray',
  Starter = 'green',
  Tree = 'lightgreen',
  Border = 'brown',
  Dev = 'blue'
}

/** Specifies the orientation of hexagons on the game board, either with flat sides facing the cardinal directions (Flat) or with points facing the cardinal directions (Angular). */
export enum EBoardHexOrientation {
  Flat = 'flat',
  Angular = 'angular'
}

/** Specifies the type of hexagon on the game board, either inner, middle, or outer. */
export enum EBoardHexType {
  InnerHex = 'inner',
  MiddleHex = 'middle',
  OuterHex = 'outer'
}
