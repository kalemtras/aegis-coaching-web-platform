export interface AthleteProfile {
  age: number
  weightKg: number

  vo2max: number

  ftp: number

  swimCss: number

  runThresholdPaceSecPerKm: number

  restingHr: number
  maxHr: number
}


export function calculateTrainingLevel(
  athlete: AthleteProfile
) {

  const enduranceScore =
    athlete.vo2max * 0.45 +
    athlete.ftp / athlete.weightKg * 0.35 +
    (100 / athlete.swimCss) * 20


  if (enduranceScore > 55)
    return "advanced"

  if (enduranceScore > 40)
    return "intermediate"

  return "developing"
}