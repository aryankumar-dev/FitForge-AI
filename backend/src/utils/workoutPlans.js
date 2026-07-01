/**
 * Fixed general 5-day workout split, and per-muscle tutorial video references.
 */

export const fiveDaySplit = {
  day1: {
    title: "Chest & Triceps",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Cable Chest Fly", sets: 3, reps: "12-15" },
      { name: "Push Ups", sets: 3, reps: "To failure" },
      { name: "Triceps Rope Pushdown", sets: 3, reps: "12-15" },
      { name: "Overhead Triceps Extension", sets: 3, reps: "10-12" },
    ],
  },
  day2: {
    title: "Back & Biceps",
    exercises: [
      { name: "Pull Ups / Lat Pulldown", sets: 4, reps: "8-10" },
      { name: "Barbell Bent Over Row", sets: 4, reps: "8-10" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12" },
      { name: "Face Pull", sets: 3, reps: "12-15" },
      { name: "Barbell Bicep Curl", sets: 3, reps: "10-12" },
      { name: "Hammer Curl", sets: 3, reps: "10-12" },
    ],
  },
  day3: {
    title: "Legs",
    exercises: [
      { name: "Barbell Back Squat", sets: 4, reps: "8-10" },
      { name: "Romanian Deadlift", sets: 3, reps: "10-12" },
      { name: "Leg Press", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg" },
      { name: "Leg Curl", sets: 3, reps: "12-15" },
      { name: "Standing Calf Raise", sets: 4, reps: "15-20" },
    ],
  },
  day4: {
    title: "Shoulders & Abs",
    exercises: [
      { name: "Overhead Barbell Press", sets: 4, reps: "8-10" },
      { name: "Lateral Raise", sets: 3, reps: "12-15" },
      { name: "Front Raise", sets: 3, reps: "12-15" },
      { name: "Rear Delt Fly", sets: 3, reps: "12-15" },
      { name: "Hanging Leg Raise", sets: 3, reps: "12-15" },
      { name: "Plank", sets: 3, reps: "45-60 sec" },
    ],
  },
  day5: {
    title: "Full Body / Cardio",
    exercises: [
      { name: "Deadlift", sets: 3, reps: "6-8" },
      { name: "Kettlebell Swings", sets: 3, reps: "15-20" },
      { name: "Burpees", sets: 3, reps: "12-15" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
      { name: "Jump Rope", sets: 3, reps: "1-2 min" },
      { name: "Treadmill / Cycling Cardio", sets: 1, reps: "20-30 min" },
    ],
  },
};

export const tutorials = {
  chest: [
    { title: "Perfect Bench Press Form", youtubeId: "rT7DgCr-3pg", url: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
    { title: "How To Bench Press (ATHLEAN-X)", youtubeId: "vcBig73ojpE", url: "https://www.youtube.com/watch?v=vcBig73ojpE" },
    { title: "Perfect Push Up Form", youtubeId: "IODxDxX7oi4", url: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { title: "Incline Dumbbell Press Tutorial", youtubeId: "8iPEnn-ltC8", url: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
    { title: "Chest Fly Form Guide", youtubeId: "eozdVDA78K0", url: "https://www.youtube.com/watch?v=eozdVDA78K0" },
  ],
  back: [
    { title: "How To Do A Pull Up", youtubeId: "eGo4IYlbE5g", url: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
    { title: "Perfect Deadlift Technique", youtubeId: "op9kVnSso6Q", url: "https://www.youtube.com/watch?v=op9kVnSso6Q" },
    { title: "Bent Over Row Form", youtubeId: "kBWAon7ItDw", url: "https://www.youtube.com/watch?v=kBWAon7ItDw" },
    { title: "Lat Pulldown Tutorial", youtubeId: "CAwf7n6Luuc", url: "https://www.youtube.com/watch?v=CAwf7n6Luuc" },
    { title: "Seated Cable Row Form", youtubeId: "GZbfZ033f74", url: "https://www.youtube.com/watch?v=GZbfZ033f74" },
  ],
  legs: [
    { title: "How To Squat Properly", youtubeId: "ultWZbUMPL8", url: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
    { title: "Romanian Deadlift Tutorial", youtubeId: "jEy_czb3RKA", url: "https://www.youtube.com/watch?v=jEy_czb3RKA" },
    { title: "Leg Press Form Guide", youtubeId: "IZxyjW7MPJQ", url: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
    { title: "Walking Lunges Tutorial", youtubeId: "L8fvypPrzzs", url: "https://www.youtube.com/watch?v=L8fvypPrzzs" },
    { title: "Standing Calf Raise Form", youtubeId: "-M4-G8p8fmc", url: "https://www.youtube.com/watch?v=-M4-G8p8fmc" },
  ],
  shoulders: [
    { title: "Overhead Press Tutorial", youtubeId: "2yjwXTZQDDI", url: "https://www.youtube.com/watch?v=2yjwXTZQDDI" },
    { title: "Lateral Raise Form Guide", youtubeId: "3VcKaXpzqRo", url: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
    { title: "Front Raise Tutorial", youtubeId: "-t7fuZ0KhDA", url: "https://www.youtube.com/watch?v=-t7fuZ0KhDA" },
    { title: "Rear Delt Fly Form", youtubeId: "EA7u4Q_8HQ0", url: "https://www.youtube.com/watch?v=EA7u4Q_8HQ0" },
    { title: "Complete Shoulder Workout Guide", youtubeId: "qEwKCR5JCog", url: "https://www.youtube.com/watch?v=qEwKCR5JCog" },
  ],
  arms: [
    { title: "Perfect Bicep Curl Form", youtubeId: "ykJmrZ5v0Oo", url: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo" },
    { title: "Triceps Pushdown Tutorial", youtubeId: "2-LAMcpzODU", url: "https://www.youtube.com/watch?v=2-LAMcpzODU" },
    { title: "Hammer Curl Form Guide", youtubeId: "zC3nLlEvin4", url: "https://www.youtube.com/watch?v=zC3nLlEvin4" },
    { title: "Overhead Triceps Extension", youtubeId: "_gsUck-7M74", url: "https://www.youtube.com/watch?v=_gsUck-7M74" },
    { title: "Complete Arm Workout", youtubeId: "DwOwe3zXqCA", url: "https://www.youtube.com/watch?v=DwOwe3zXqCA" },
  ],
  abs: [
    { title: "Hanging Leg Raise Tutorial", youtubeId: "Pr1ieGZ5atk", url: "https://www.youtube.com/watch?v=Pr1ieGZ5atk" },
    { title: "Perfect Plank Form", youtubeId: "pSHjTRCQxIw", url: "https://www.youtube.com/watch?v=pSHjTRCQxIw" },
    { title: "10 Min Abs Workout", youtubeId: "1919eTCoESo", url: "https://www.youtube.com/watch?v=1919eTCoESo" },
    { title: "Mountain Climbers Form", youtubeId: "nmwgirgXLYM", url: "https://www.youtube.com/watch?v=nmwgirgXLYM" },
    { title: "Complete Core Workout Guide", youtubeId: "DHOOaez6xIA", url: "https://www.youtube.com/watch?v=DHOOaez6xIA" },
  ],
};

export const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "abs"];

export const getWorkoutPlan = (muscle) => {
  const key = (muscle || "").toLowerCase();
  if (!MUSCLE_GROUPS.includes(key)) {
    const error = new Error(
      `Invalid muscle group. Must be one of: ${MUSCLE_GROUPS.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    muscle: key,
    tutorials: tutorials[key],
    fiveDaySplit,
  };
};

export default getWorkoutPlan;
