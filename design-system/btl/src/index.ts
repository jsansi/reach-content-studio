export * from './parts';
export * from './slides';
export { spinalDecompressionImages } from './assets';
export type { IconName } from './context';

/** BTL brand colors (Corporate Identity v2.3, p. 14). */
export const btlColors = {
  enterpriseBlue: '#00508c',
  darkBlue: '#000a32',
  skyBlue: '#96d2ff',
  white: '#ffffff',
} as const;
