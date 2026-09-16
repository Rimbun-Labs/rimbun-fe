import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";

describe("ChatMessageBubble", () => {
  it("renders assistant content as text, not HTML", () => {
    render(
      <MemoryRouter>
        <ChatMessageBubble
          message={{
            id: "1",
            role: "assistant",
            content: '<img src=x onerror="alert(1)">Cash is 100',
            evidence: [],
            limitations: ["Bank balance is missing"],
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(/img src/)).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText(/Bank balance is missing/)).toBeInTheDocument();
  });

  it("keeps a failed user question visible", () => {
    render(
      <MemoryRouter>
        <ChatMessageBubble
          message={{
            id: "2",
            role: "user",
            content: "What is my current cash position?",
            generationStatus: "failed",
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("What is my current cash position?")).toBeInTheDocument();
    expect(screen.getByText("Not answered")).toBeInTheDocument();
  });
});
