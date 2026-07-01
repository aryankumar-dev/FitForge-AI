const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Calculates BMR using the Mifflin-St Jeor equation.
 */
export const calculateBMR = ({ gender, weight, height, age }) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
};

/**
 * Calculates BMR, TDEE, and calorie target based on user's health profile and goal.
 * Throws an error if required fields are missing.
 */
export const calculateCalories = (user) => {
  const { gender, weight, height, age, activityLevel, goal } = user;

  if (!gender || !weight || !height || !age || !activityLevel || !goal) {
    const error = new Error(
      "Missing required health fields (gender, weight, height, age, activityLevel, goal) to calculate calories"
    );
    error.statusCode = 400;
    throw error;
  }

  const bmr = calculateBMR({ gender, weight, height, age });
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];

  if (!multiplier) {
    const error = new Error("Invalid activityLevel");
    error.statusCode = 400;
    throw error;
  }

  const tdee = bmr * multiplier;

  let calorieTarget;
  switch (goal) {
    case "weight_loss":
      calorieTarget = tdee - 500;
      break;
    case "weight_gain":
    case "muscle_gain":
      calorieTarget = tdee + 500;
      break;
    case "maintain":
    default:
      calorieTarget = tdee;
      break;
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    goal,
  };
};

export default calculateCalories;
