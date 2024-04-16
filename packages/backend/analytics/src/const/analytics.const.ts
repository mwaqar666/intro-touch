import type { TAnalyticsDuration } from "@/backend/analytics/types";

export class AnalyticsConst {
	public static readonly ValidAnalyticsDuration: Array<TAnalyticsDuration> = ["today", "lastWeek", "lastMonth"];
}
