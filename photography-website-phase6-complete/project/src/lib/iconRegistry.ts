import {
  Camera, Film, Heart, Users, Palette, Video, Sparkles, Award, Aperture,
  Clapperboard, Wand2, Layers, type LucideIcon,
} from 'lucide-react';

export const iconRegistry: Record<string, LucideIcon> = {
  Camera, Film, Heart, Users, Palette, Video, Sparkles, Award, Aperture,
  Clapperboard, Wand2, Layers,
};

export const iconNames = Object.keys(iconRegistry);

export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && iconRegistry[name]) || Camera;
}
