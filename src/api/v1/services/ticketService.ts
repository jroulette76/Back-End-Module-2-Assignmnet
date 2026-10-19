import { tickets } from "../../../data/tickets";
import type { Ticket } from "../models/ticketModel";

/**
 * Get all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(tickets);
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (id: number): Promise<Ticket> => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) {
        throw new Error(`Ticket not found`);
    }
    
    return structuredClone(ticket);
};

/**
 * Create a new ticket
 */
export const createTicket = async (data: {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
}): Promise<Ticket> => {
  const newTicket: Ticket = {
    id: tickets.length + 1,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: "open",
    createdAt: new Date(),
  };

  tickets.push(newTicket);
  return structuredClone(newTicket);
};

/**
 * Update an existing ticket
 */
export const updateTicket = async (
  id: number,
  updates: Partial<Pick<Ticket, "title" | "description" | "priority" | "status">>
): Promise<Ticket> => {
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`Ticket not found`);
  }

  tickets[index] = {
    ...tickets[index],
    ...updates,
  };

  return structuredClone(tickets[index]);
};

/**
 * Delete a ticket by ID
 */
export const deleteTicket = async (id: number): Promise<void> => {
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`Ticket not found`);
  }

  tickets.splice(index, 1);
};

/**
 * Calculate ticket urgency
 */
export const calculateUrgency = async (ticket: Ticket): Promise<{
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}> => {
  const ticketAge = calculateTicketAge(ticket.createdAt);

  // Resolved tickets always have zero urgency
  if (ticket.status === "resolved") {
    return {
      ticketAge,
      urgencyScore: 0,
      urgencyLevel: "Minimal. Ticket resolved.",
    };
  }

  const baseScore = getBaseScore(ticket.priority);
  const urgencyScore = baseScore + ticketAge * 5;
  const urgencyLevel = getUrgencyLevel(urgencyScore);

  return {
    ticketAge,
    urgencyScore,
    urgencyLevel,
  };
};

/**
 * Calculate ticket age in whole days
 */
export const calculateTicketAge = (createdAt: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Base scores by priority
 */
export const getBaseScore = (priority: Ticket["priority"]): number => {
  switch (priority) {
    case "critical":
      return 50;
    case "high":
      return 30;
    case "medium":
      return 20;
    case "low":
      return 10;
  }
};

/**
 * Determine urgency level based on score
 */
export const getUrgencyLevel = (score: number): string => {
  if (score < 30) return "Low urgency. Address when capacity allows.";
  if (score < 55) return "Moderate. Schedule for attention.";
  if (score <= 80) return "High urgency. Prioritize resolution.";
  return "Critical. Immediate attention required.";
};
