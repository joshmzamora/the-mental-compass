export const focusLabels: Record<string, string> = {
  anxiety: "anxiety",
  depression: "depression",
  stress: "stress",
  trauma: "trauma",
  grief: "grief",
  relationships: "relationships",
  addiction: "addiction",
  wellness: "wellness",
};

const fallbackFocus = "wellness";

const focusTerms: Record<string, string[]> = {
  anxiety: ["anxiety", "worry", "panic", "stress", "grounding", "workplace"],
  depression: ["depression", "sadness", "mood", "support", "self-compassion"],
  stress: ["stress", "anxiety", "workplace", "burnout", "wellness", "sleep"],
  trauma: ["trauma", "ptsd", "safety", "support", "stigma"],
  grief: ["grief", "loss", "depression", "support", "care"],
  relationships: ["relationship", "relationships", "support", "community", "care", "communication"],
  addiction: ["addiction", "substance", "support", "coping", "wellness"],
  wellness: ["wellness", "sleep", "habits", "mindfulness", "stigma", "support"],
};

const journeyCategories: Record<string, string[]> = {
  anxiety: ["Anxiety", "Wellness"],
  depression: ["Depression", "Wellness"],
  stress: ["Wellness", "Anxiety"],
  trauma: ["Depression", "Advocacy", "Wellness"],
  grief: ["Depression", "Wellness"],
  relationships: ["Wellness", "Advocacy"],
  addiction: ["Wellness", "Depression", "Advocacy"],
  wellness: ["Wellness", "Advocacy"],
};

const therapistSpecialties: Record<string, string[]> = {
  anxiety: ["Anxiety", "Stress Management"],
  depression: ["Depression", "Mood Disorders"],
  stress: ["Stress Management", "Wellness", "Mindfulness"],
  trauma: ["PTSD", "Trauma", "Grief Counseling"],
  grief: ["Grief Counseling", "Trauma", "Depression"],
  relationships: ["Relationships", "Family Therapy", "Couples Therapy", "Communication"],
  addiction: ["Addiction", "Substance Abuse", "Dual Diagnosis"],
  wellness: ["Mindfulness", "Wellness", "Life Coaching"],
};

const communityTags: Record<string, string[]> = {
  anxiety: ["Anxiety", "Coping", "Stress", "Support", "Wellness"],
  depression: ["Depression", "Support", "Wellness", "Coping"],
  stress: ["Stress", "Coping", "Wellness", "Anxiety"],
  trauma: ["Trauma", "PTSD", "Support", "Coping"],
  grief: ["Grief", "Support", "Depression", "Wellness"],
  relationships: ["Relationships", "Support", "Community", "Wellness"],
  addiction: ["Addiction", "Recovery", "Support", "Coping"],
  wellness: ["Wellness", "Mindfulness", "Support", "Coping"],
};

const disorderIds: Record<string, string[]> = {
  anxiety: ["anxiety", "gad", "panic-disorder", "social-anxiety"],
  depression: ["depression", "persistent-depressive-disorder", "seasonal-affective-disorder"],
  stress: ["anxiety", "gad", "insomnia-disorder"],
  trauma: ["ptsd", "dissociative-disorders", "bpd"],
  grief: ["depression", "ptsd", "persistent-depressive-disorder"],
  relationships: ["social-anxiety", "bpd", "depression"],
  addiction: ["substance-use-disorder", "depression", "anxiety"],
  wellness: ["insomnia-disorder", "anxiety", "depression"],
};

export function normalizeFocus(focus?: string) {
  const normalized = (focus || fallbackFocus).toLowerCase();
  return focusLabels[normalized] ? normalized : fallbackFocus;
}

export function getFocusTerms(focus?: string) {
  return focusTerms[normalizeFocus(focus)];
}

export function getRecommendedJourneyCategories(focus?: string) {
  return journeyCategories[normalizeFocus(focus)];
}

export function getRecommendedTherapistSpecialties(focus?: string) {
  return therapistSpecialties[normalizeFocus(focus)];
}

export function getRecommendedCommunityTags(focus?: string) {
  return communityTags[normalizeFocus(focus)];
}

export function getRecommendedDisorderIds(focus?: string) {
  return disorderIds[normalizeFocus(focus)];
}

export function includesAnyTerm(value: string, terms: string[]) {
  const normalizedValue = value.toLowerCase();
  return terms.some((term) => normalizedValue.includes(term.toLowerCase()));
}

export function scoreTextMatch(values: string[], terms: string[]) {
  const searchable = values.join(" ").toLowerCase();
  return terms.reduce((score, term) => {
    return searchable.includes(term.toLowerCase()) ? score + 1 : score;
  }, 0);
}

export function fillToCount<T>(
  recommended: T[],
  fallbackItems: T[],
  count: number,
  getId: (item: T) => string,
) {
  const seen = new Set<string>();
  const result: T[] = [];

  [...recommended, ...fallbackItems].forEach((item) => {
    const id = getId(item);
    if (seen.has(id) || result.length >= count) return;
    seen.add(id);
    result.push(item);
  });

  return result;
}
