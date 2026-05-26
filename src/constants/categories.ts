import { ReminderCategory } from '@/types';

export interface ReminderCategoryConfig {
  id: ReminderCategory;
  label: string;
  color: string;
  iconBgClass: string;
  textClass: string;
}

export const REMINDER_CATEGORIES: ReminderCategoryConfig[] = [
  {
    id: ReminderCategory.WORK,
    label: 'Work',
    color: '#C084FC',
    iconBgClass: 'bg-purple-600/10',
    textClass: 'text-purple-400',
  },
  {
    id: ReminderCategory.PERSONAL,
    label: 'Personal',
    color: '#F472B6',
    iconBgClass: 'bg-pink-600/10',
    textClass: 'text-pink-400',
  },
  {
    id: ReminderCategory.SOCIAL,
    label: 'Social',
    color: '#FBBF24',
    iconBgClass: 'bg-amber-600/10',
    textClass: 'text-amber-400',
  },
  {
    id: ReminderCategory.OTHER,
    label: 'Other',
    color: '#71717A',
    iconBgClass: 'bg-zinc-800/20',
    textClass: 'text-zinc-500',
  },
];

const CATEGORY_CONFIG_BY_ID = REMINDER_CATEGORIES.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {} as Record<ReminderCategory, ReminderCategoryConfig>);

export const normalizeReminderCategory = (category?: ReminderCategory | string | null) => {
  const normalized = String(category ?? '').toLowerCase();

  if (normalized === ReminderCategory.WORK) return ReminderCategory.WORK;
  if (normalized === ReminderCategory.PERSONAL) return ReminderCategory.PERSONAL;
  if (normalized === ReminderCategory.SOCIAL) return ReminderCategory.SOCIAL;
  if (normalized === ReminderCategory.OTHER) return ReminderCategory.OTHER;

  return ReminderCategory.OTHER;
};

export const getReminderCategoryConfig = (category?: ReminderCategory | string | null) => {
  return CATEGORY_CONFIG_BY_ID[normalizeReminderCategory(category)];
};

export const getReminderCategoryColor = (category?: ReminderCategory | string | null) => {
  return getReminderCategoryConfig(category).color;
};
