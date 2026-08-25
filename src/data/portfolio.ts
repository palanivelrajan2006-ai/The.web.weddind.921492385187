/**
 * ============================================================
 *  PORTFOLIO DATA — Replace with your real work
 * ============================================================
 *  Each item has a category for filtering. Replace the
 *  image URLs with your own hosted images/videos.
 *  For video items, set `type: 'video'` and add a
 *  `videoUrl` pointing to your hosted video file.
 */

export type PortfolioCategory =
  | 'Weddings'
  | 'Events'
  | 'Pre-Wedding'
  | 'Portraits'
  | 'Modeling'
  | 'Fashion'
  | 'Videos';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  type: 'image' | 'video';
  videoUrl?: string;
  span?: 'tall' | 'wide' | 'normal';
}

export const portfolioCategories: ('All' | PortfolioCategory)[] = [
  'All',
  'Weddings',
  'Events',
  'Portraits',
  'Modeling',
  'Fashion',
  'Videos',
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Lantern Light Embrace',
    category: 'Weddings',
    image: 'https://images.pexels.com/photos/38823745/pexels-photo-38823745.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'image',
    span: 'wide',
  },
  {
    id: 'p2',
    title: 'Studio Fashion — Black Dress',
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/33714925/pexels-photo-33714925.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p3',
    title: 'Autumn Forest Couple',
    category: 'Pre-Wedding',
    image: 'https://images.pexels.com/photos/31248277/pexels-photo-31248277.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'normal',
  },
  {
    id: 'p4',
    title: 'Concert Lights & Confetti',
    category: 'Events',
    image: 'https://images.pexels.com/photos/7081180/pexels-photo-7081180.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'image',
    span: 'wide',
  },
  {
    id: 'p5',
    title: 'Studio Portrait Session',
    category: 'Portraits',
    image: 'https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p6',
    title: 'Urban Fashion Portrait',
    category: 'Modeling',
    image: 'https://images.pexels.com/photos/852854/pexels-photo-852854.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p7',
    title: 'Wedding Dance — Top View',
    category: 'Weddings',
    image: 'https://images.pexels.com/photos/16229516/pexels-photo-16229516.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'image',
    span: 'normal',
  },
  {
    id: 'p8',
    title: 'Desert Dunes Couple',
    category: 'Pre-Wedding',
    image: 'https://images.pexels.com/photos/21319655/pexels-photo-21319655.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'image',
    span: 'wide',
  },
  {
    id: 'p9',
    title: 'Birthday Celebration',
    category: 'Events',
    image: 'https://images.pexels.com/photos/30692831/pexels-photo-30692831.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'normal',
  },
  {
    id: 'p10',
    title: 'Editorial — Red Suit',
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/38290948/pexels-photo-38290948.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p11',
    title: 'Bride & Groom Joy',
    category: 'Weddings',
    image: 'https://images.pexels.com/photos/38708859/pexels-photo-38708859.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'normal',
  },
  {
    id: 'p12',
    title: 'Studio Fashion Shoot',
    category: 'Modeling',
    image: 'https://images.pexels.com/photos/19222080/pexels-photo-19222080.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p13',
    title: 'Cinematic Wedding Film',
    category: 'Videos',
    image: 'https://images.pexels.com/photos/6198377/pexels-photo-6198377.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'video',
    span: 'wide',
  },
  {
    id: 'p14',
    title: 'Behind the Lens',
    category: 'Videos',
    image: 'https://images.pexels.com/photos/13811053/pexels-photo-13811053.jpeg?auto=compress&cs=tinysrgb&w=900',
    type: 'video',
    span: 'wide',
  },
  {
    id: 'p15',
    title: 'Elegant Indoor Portrait',
    category: 'Portraits',
    image: 'https://images.pexels.com/photos/38996230/pexels-photo-38996230.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'tall',
  },
  {
    id: 'p16',
    title: 'Historic Church Pre-Wedding',
    category: 'Pre-Wedding',
    image: 'https://images.pexels.com/photos/30871487/pexels-photo-30871487.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'image',
    span: 'normal',
  },
];
