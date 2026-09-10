export type CreatorType = "bride" | "groom" | "other";

export type Person = {
  id?: number;
  creator_type: "bride" | "groom";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  fathers_name?: string | null;
  mothers_name?: string | null;
};

export type WeddingEvent = {
  id?: number;
  title: string;
  dress_code?: string | null;
  description?: string | null;
  is_music_or_dancing: boolean;
};

export type WeddingDay = {
  id?: number;
  wedding_day_date: string;
  wedding_day_time?: string | null;
  venue_name?: string | null;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  post_code?: string | null;
  landmark_near?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  events: WeddingEvent[];
};

export type WeddingImage = {
  id: number;
  image: string;
  url: string;
  sort_order: number;
};

export type WeddingDraft = {
  id: number;
  creator_type: CreatorType;
  creator_type_other?: string | null;
  description?: string | null;
  video_url?: string | null;
  food_observance?: string | null;
  languages?: string[];
  is_alcohol_offered?: boolean | null;
  status: string;
  creators: Person[];
  days: WeddingDay[];
  images: WeddingImage[];
};
