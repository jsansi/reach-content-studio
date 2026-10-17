// Official BTL Spinal Decompression images (knowledge/products + public/assets/products), embedded so
// designs can use them without a file server. Never substitute other equipment photos.
import aplicacionLumbar from '../../../public/assets/products/spinal-decompression/aplicacion-dolor-lumbar-cronico.jpg';
import productLogoWhite from '../../../public/assets/products/spinal-decompression/logo/spinal-decompression-logo-white.png';
import flexionPelvica from '../../../public/assets/products/spinal-decompression/posiciones/flexion-pelvica.png';
import prono from '../../../public/assets/products/spinal-decompression/posiciones/roof-prono.png';
import semiincorporada from '../../../public/assets/products/spinal-decompression/posiciones/semiincorporada-inclinada.png';
import equipo from '../../../public/assets/products/spinal-decompression/spinal-decompression.jpg';

/** Official BTL Spinal Decompression images as data URLs. */
export const spinalDecompressionImages = {
  /** Device alone, side view, white background (1920×1080). */
  equipo,
  /** Patient prone during a chronic low-back application, white background (540×360). */
  aplicacionLumbar,
  /** Patient semi-reclined, transparent background (688×367). */
  semiincorporada,
  /** Patient supine with pelvic flexion, white background (767×385). */
  flexionPelvica,
  /** Patient prone with the control unit, transparent background (623×387). */
  prono,
  /** White "SPINAL DECOMPRESSION" product logo for dark backgrounds (400×68). */
  productLogoWhite,
};

const base = 'public/assets/products/spinal-decompression/';
export const assetByRepoPath: Record<string, string> = {
  [base + 'spinal-decompression.jpg']: equipo,
  [base + 'aplicacion-dolor-lumbar-cronico.jpg']: aplicacionLumbar,
  [base + 'posiciones/semiincorporada-inclinada.png']: semiincorporada,
  [base + 'posiciones/flexion-pelvica.png']: flexionPelvica,
  [base + 'posiciones/roof-prono.png']: prono,
  [base + 'logo/spinal-decompression-logo-white.png']: productLogoWhite,
};
