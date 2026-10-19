import type { Ticket } from "../api/v1/models/ticketModel";

/**
 * In-memory ticket data for the assignment and testing
 */

export const tickets: Ticket[] = [
  {
    id: 1,
    title: "Update footer copyright year",
    description: "Footer still shows 2024",
    priority: "low",
    status: "open",
    createdAt: new Date("2026-10-16T10:00:00.000Z"), // 3 day old
  },
  {
    id: 2,
    title: "Profile picture upload slow",
    description: "Upload takes 30+ seconds",
    priority: "medium",
    status: "open",
    createdAt: new Date("2026-10-17T10:00:00.000Z"), // 2 days old
  },
  {
    id: 3,
    title: "Dashboard loading slowly",
    description: "Dashboard takes 10+ seconds to load",
    priority: "medium",
    status: "open",
    createdAt: new Date("2026-10-13T10:00:00.000Z"), // 6 days old
  },
  {
    id: 4,
    title: "Password reset email delayed",
    description: "Reset emails taking over 30 minutes",
    priority: "high",
    status: "open",
    createdAt: new Date("2026-10-14T10:00:00.000Z"), // 5 days old
  },
  {
    id: 5,
    title: "Export to PDF not working",
    description: "PDF export fails silently",
    priority: "high",
    status: "open",
    createdAt: new Date("2026-10-07T10:00:00.000Z"), // 12 days old
  },
  {
    id: 6,
    title: "Login page not loading",
    description: "Users report blank screen on login",
    priority: "critical",
    status: "open",
    createdAt: new Date("2026-10-12T10:00:00.000Z"), // 7 days old
  },
  {
    id: 7,
    title: "Dark mode toggle broken",
    description: "Dark mode doesn't persist after refresh",
    priority: "medium",
    status: "resolved",
    createdAt: new Date("2026-10-09T10:00:00.000Z"), // 10 days old
  },
];
