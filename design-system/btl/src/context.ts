// Brand assets shared by the primitives: the official logo and the approved icon set.
import logoSvg from '../../../public/assets/brands/btl/logo/btl-logo.svg';
import accessibilityNew from '../../../public/assets/icons/accessibility_new.svg';
import airlineSeatFlat from '../../../public/assets/icons/airline_seat_flat.svg';
import checklist from '../../../public/assets/icons/checklist.svg';
import doNotTouch from '../../../public/assets/icons/do_not_touch.svg';
import patientList from '../../../public/assets/icons/patient_list.svg';
import shieldPerson from '../../../public/assets/icons/shield_person.svg';
import swipeLeft from '../../../public/assets/icons/swipe_left.svg';
import trendingUp from '../../../public/assets/icons/trending_up.svg';

/** Material Symbols Sharp (weight 100) icons approved for BTL slides. */
export type IconName = 'accessibility_new' | 'airline_seat_flat' | 'checklist' | 'do_not_touch' | 'patient_list' | 'shield_person' | 'swipe_left' | 'trending_up';

const icons: Record<IconName, string> = {
  accessibility_new: accessibilityNew,
  airline_seat_flat: airlineSeatFlat,
  checklist,
  do_not_touch: doNotTouch,
  patient_list: patientList,
  shield_person: shieldPerson,
  swipe_left: swipeLeft,
  trending_up: trendingUp,
};

export const iconSvg = (name: string): string => {
  const svg = icons[name as IconName];
  if (!svg) throw new Error(`Unknown BTL icon "${name}". Available: ${Object.keys(icons).join(', ')}`);
  return svg.replace(/ width="\d+" height="\d+"/, '').replace('<svg ', '<svg aria-hidden="true" ');
};

export const logoMarkup: string = logoSvg;
