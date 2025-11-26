declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module 'electron-squirrel-startup' {
  const squirrelStartup: boolean;
  export default squirrelStartup;
}