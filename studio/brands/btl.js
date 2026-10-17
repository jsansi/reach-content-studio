// BTL brand tokens, taken from knowledge/brand-guidelines/btl_corporate_identity.pdf (v2.3).
export const btl = {
  colors: {
    enterpriseBlue: '#00508c', // primary
    darkBlue: '#000a32',
    skyBlue: '#96d2ff',
    white: '#ffffff',
  },
  logo: 'public/assets/brands/btl/logo/btl-logo.svg', // vector extracted from the manual, p. 4
  logoRatio: 1015.24 / 475.0,
  fontDir: 'public/assets/fonts/noto-sans',
  iconDir: 'public/assets/icons', // Material Symbols Sharp, weight 100 (manual p. 27)
  // Social format: 1080 px short side → logo 140–300 px wide (manual p. 7).
  logoWidth: 200,
  // Type scale from the manual (p. 20): T = 2/3 S, H2 = 2S, H1 = 4S.
  bodySize: 30,
};

// Spacing unit U = half the logo height (manual p. 5).
export const unit = (brand) => brand.logoWidth / brand.logoRatio / 2;
