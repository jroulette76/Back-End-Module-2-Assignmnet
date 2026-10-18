import request from "supertest";
import app from "../src/server";

describe("Ticket Routes API", () => {

  // GET /tickets/:id
  describe("GET /api/v1/tickets/:id", () => {

    it("should retrieve a ticket by ID", async () => {
      // Act
      const res = await request(app).get("/api/v1/tickets/1");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ticket retrieved");
      expect(res.body.data).toHaveProperty("id", 1);
      expect(res.body.data).toHaveProperty("title");
      expect(res.body.data).toHaveProperty("description");
      expect(res.body.data).toHaveProperty("priority");
    });

    it("should return 400 for invalid ticket ID", async () => {
      // Act
      const res = await request(app).get("/api/v1/tickets/abc");

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid ticket ID");
    });

  });

  // POST /tickets
  describe("POST /api/v1/tickets", () => {

    it("should create a new ticket", async () => {
      // Arrange
      const newTicket = {
        title: "New Issue",
        description: "Something is not working",
        priority: "high"
      };

      // Act
      const res = await request(app)
        .post("/api/v1/tickets")
        .send(newTicket);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Ticket created");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe(newTicket.title);
      expect(res.body.data.description).toBe(newTicket.description);
      expect(res.body.data.priority).toBe(newTicket.priority);
    });

    it("should return 400 when title is missing", async () => {
      // Act
      const res = await request(app)
        .post("/api/v1/tickets")
        .send({
          description: "Test description",
          priority: "low"
        });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required field: title");
    });

  });

  // PUT /tickets/:id
  describe("PUT /api/v1/tickets/:id", () => {

    it("should update an existing ticket", async () => {
      // Arrange
      const updatedTicket = {
        title: "Updated Issue",
        description: "Updated description",
        priority: "low"
      };

      // Act
      const res = await request(app)
        .put("/api/v1/tickets/1")
        .send(updatedTicket);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ticket updated");
      expect(res.body.data.id).toBe(1);
      expect(res.body.data.title).toBe(updatedTicket.title);
      expect(res.body.data.description).toBe(updatedTicket.description);
      expect(res.body.data.priority).toBe(updatedTicket.priority);
    });

    it("should return 400 when priority is invalid", async () => {
      // Act
      const res = await request(app)
        .put("/api/v1/tickets/1")
        .send({ priority: "urgent" });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Invalid priority. Must be one of: critical, high, medium, low"
      );
    });

  });

  // GET /tickets/:id/urgency
  describe("GET /api/v1/tickets/:id/urgency", () => {

    it("should return urgency details for a ticket", async () => {
      // Act
      const res = await request(app).get("/api/v1/tickets/1/urgency");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ticket urgency calculated");
      expect(res.body.data).toHaveProperty("urgencyScore");
      expect(typeof res.body.data.urgencyScore).toBe("number");
      expect(res.body.data).toHaveProperty("urgencyLevel");
    });

    it("should return 400 for invalid ticket ID", async () => {
      // Act
      const res = await request(app).get("/api/v1/tickets/abc/urgency");

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid ticket ID");
    });

  });

});
