declare module "*.css" {
  const classes: {
      use: () => void;
      unuse: () => void;
   };
  export default classes;
}
declare module "*.png" {
  const path: string;
  export default path;
}

declare module "@material-ui/*"
declare module "devextreme-react/*"
