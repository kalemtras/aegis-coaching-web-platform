export interface TrainingLoad {
  tss: number
  hours: number
}


export function calculateLoadStress(
  load: TrainingLoad[]
) {

  const totalTss =
    load.reduce(
      (sum,item)=>sum+item.tss,
      0
    )


  const totalHours =
    load.reduce(
      (sum,item)=>sum+item.hours,
      0
    )


  return {
    totalTss,
    totalHours,
    intensity:
      totalHours > 0
      ? totalTss / totalHours
      : 0
  }
}