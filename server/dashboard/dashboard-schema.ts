import { z } from "zod"

export const getDashboardSchema = z.object({})

export type GetDashboardInput = z.input<typeof getDashboardSchema>
