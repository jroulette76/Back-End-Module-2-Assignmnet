import type { Request, Response } from "express";
import * as ticketService from "../services/ticketService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import type { Ticket } from "../models/ticketModel"; 

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets: Ticket[] = await ticketService.getAllTickets();

    return res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved",
      count: tickets.length,
      data: tickets,
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket: Ticket = await ticketService.getTicketById(id);

    return res.status(HTTP_STATUS.OK).json({
      message: "Ticket retrieved",
      data: ticket,
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: error.message,
    });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Missing required field: title",
      });
    }

    if (!description) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Missing required field: description",
      });
    }

    const allowedPriorities = ["critical", "high", "medium", "low"];
    if (!priority || !allowedPriorities.includes(priority)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
    }

    const newTicket = await ticketService.createTicket({
      title,
      description,
      priority,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "Ticket created",
      data: newTicket,
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};


export const updateTicket = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid ticket ID",
      });
    }

    const updates = req.body;

    const allowedPriorities = ["critical", "high", "medium", "low"];
    const allowedStatuses = ["open", "in-progress", "resolved"];

    if (updates.priority && !allowedPriorities.includes(updates.priority)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
    }

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid status. Must be one of: open, in-progress, resolved",
      });
    }

    const updatedTicket = await ticketService.updateTicket(id, updates);

    return res.status(HTTP_STATUS.OK).json({
      message: "Ticket updated",
      data: updatedTicket,
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: error.message,
    });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid ticket ID",
      });
    }

    await ticketService.deleteTicket(id);

    return res.status(HTTP_STATUS.OK).json({
      message: "Ticket deleted",
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: error.message,
    });
  }
};

export const getTicketUrgency = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await ticketService.getTicketById(id);
    const urgency = await ticketService.calculateUrgency(ticket);

    return res.status(HTTP_STATUS.OK).json({
      message: "Ticket urgency calculated",
      data: {
        ...ticket,
        ...urgency,
      },
    });
  } catch (error: any) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: error.message,
    });
  }
};
