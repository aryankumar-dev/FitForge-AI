/**
 * Rule-based (non-AI) Indian-style diet plan generator.
 * Buckets calorieTarget into ranges and returns a full-day meal plan
 * with veg / nonveg variants for each bucket.
 */

const DIET_PLANS = {
  "<1500": {
    veg: {
      breakfast: "Vegetable poha (1 bowl, ~150g) with a handful of roasted peanuts and a cup of unsweetened green tea",
      midMorningSnack: "1 small seasonal fruit (apple or orange) + 5 soaked almonds",
      lunch: "1 roti + 1 bowl moong dal + 1 bowl mixed vegetable sabzi + small bowl of curd",
      eveningSnack: "Roasted chana (1 small bowl) or sprouts salad with lemon",
      dinner: "1 bowl vegetable soup + 1 small bowl paneer bhurji (50g paneer) + 1 roti",
    },
    nonveg: {
      breakfast: "2 boiled egg whites + 1 vegetable-stuffed multigrain roti + black coffee",
      midMorningSnack: "1 small seasonal fruit + a few walnuts",
      lunch: "1 roti + 100g grilled chicken breast + 1 bowl mixed vegetable sabzi",
      eveningSnack: "Sprouts salad with lemon and chaat masala",
      dinner: "Clear chicken/vegetable soup + 100g grilled fish or chicken + sauteed greens",
    },
  },
  "1500-2000": {
    veg: {
      breakfast: "2 moong dal chillas with mint chutney + 1 cup toned milk or curd",
      midMorningSnack: "1 banana or seasonal fruit + 6-8 almonds",
      lunch: "2 rotis + 1 bowl dal tadka + 1 bowl sabzi + small bowl rice + salad",
      eveningSnack: "Sprouts + roasted makhana (fox nuts) bowl",
      dinner: "2 rotis + paneer tikka (100g) or soya chunk curry + salad",
    },
    nonveg: {
      breakfast: "3-egg omelette with vegetables + 1 slice multigrain toast + tea/coffee",
      midMorningSnack: "1 fruit + a small handful of mixed nuts",
      lunch: "2 rotis + 150g grilled/curry chicken + 1 bowl dal + salad",
      eveningSnack: "Boiled egg (1-2) with black pepper and chaat masala",
      dinner: "150g grilled fish or chicken curry + 1 roti + sauteed vegetables",
    },
  },
  "2000-2500": {
    veg: {
      breakfast: "3 vegetable-stuffed parathas with curd and pickle + a glass of lassi",
      midMorningSnack: "Mixed fruit bowl + a handful of dry fruits (almonds, walnuts, raisins)",
      lunch: "Full thali: 3 rotis + rice + dal makhani + paneer sabzi + salad + curd",
      eveningSnack: "Peanut chikki or roasted chana with a cup of milk",
      dinner: "2-3 rotis + rajma or chole curry + 1 bowl rice + salad",
    },
    nonveg: {
      breakfast: "4-egg bhurji with onions/tomatoes + 2 multigrain toasts + a glass of milk",
      midMorningSnack: "Mixed fruit bowl + a handful of nuts",
      lunch: "3 rotis + 200g chicken curry + 1 bowl rice + salad + curd",
      eveningSnack: "Grilled chicken strips (small portion) or 2-3 boiled eggs",
      dinner: "200g fish curry or chicken tikka + 2 rotis + sauteed vegetables",
    },
  },
  "2500-3000": {
    veg: {
      breakfast: "4 parathas with paneer stuffing + curd + a glass of full-fat milk with dry fruits",
      midMorningSnack: "Banana shake with peanut butter + a handful of mixed nuts",
      lunch: "Big thali: 4 rotis + 1.5 bowl rice + dal + paneer/soya sabzi + salad + curd + ghee",
      eveningSnack: "Peanut/jaggery chikki + roasted makhana + a glass of milk",
      dinner: "3 rotis + rajma-chole mix + 1 bowl rice + vegetable sabzi + curd",
    },
    nonveg: {
      breakfast: "5-egg omelette with cheese + 2-3 multigrain toasts + a glass of milk with banana",
      midMorningSnack: "Protein shake or peanut butter banana sandwich + nuts",
      lunch: "4 rotis + 250g chicken/mutton curry + 1.5 bowl rice + salad + curd",
      eveningSnack: "Grilled chicken (150g) or 3-4 boiled eggs with a fruit",
      dinner: "3 rotis + 250g fish/chicken curry + 1 bowl rice + sauteed vegetables",
    },
  },
  ">3000": {
    veg: {
      breakfast: "5-6 parathas with paneer/ghee + a large bowl of curd + dry fruit milkshake",
      midMorningSnack: "Peanut butter banana shake + soaked almonds, walnuts and raisins",
      lunch: "Large thali: 5 rotis + 2 bowls rice + dal + paneer/soya curry + ghee + salad + curd + buttermilk",
      eveningSnack: "Trail mix (nuts + seeds + jaggery) + a glass of milk with dates",
      dinner: "4 rotis + 2 bowls mixed dal/paneer curry + rice + sabzi + curd",
    },
    nonveg: {
      breakfast: "6-egg omelette/bhurji with cheese + 3 multigrain toasts + a large glass of milk with a banana",
      midMorningSnack: "Mass-gainer shake or peanut butter sandwich + mixed nuts",
      lunch: "5 rotis + 300g chicken/mutton curry + 2 bowls rice + salad + curd",
      eveningSnack: "200g grilled chicken or 4-5 boiled eggs with a fruit smoothie",
      dinner: "4 rotis + 300g fish/chicken curry + 1.5 bowl rice + sauteed vegetables + curd",
    },
  },
};

/**
 * Returns the calorie bucket key for a given calorieTarget.
 */
export const getCalorieBucket = (calorieTarget) => {
  if (calorieTarget < 1500) return "<1500";
  if (calorieTarget < 2000) return "1500-2000";
  if (calorieTarget < 2500) return "2000-2500";
  if (calorieTarget < 3000) return "2500-3000";
  return ">3000";
};

/**
 * Returns a full-day Indian-style meal plan for the given calorieTarget and dietPreference.
 */
export const getDietPlan = (calorieTarget, dietPreference = "veg") => {
  const bucket = getCalorieBucket(calorieTarget);
  const preference = dietPreference === "nonveg" ? "nonveg" : "veg";
  return DIET_PLANS[bucket][preference];
};

export default getDietPlan;
