import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "partial-call" | "call" | "result" = "result"
): ToolInvocation {
  return {
    toolCallId: "test-id",
    toolName,
    args,
    state,
    ...(state === "result" ? { result: "ok" } : {}),
  } as ToolInvocation;
}

// str_replace_editor labels
test("shows 'Creating <filename>' for create command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "src/Button.tsx" })} />);
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("shows 'Editing <filename>' for str_replace command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "src/Card.tsx" })} />);
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("shows 'Editing <filename>' for insert command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "src/index.ts" })} />);
  expect(screen.getByText("Editing index.ts")).toBeDefined();
});

test("shows 'Reading <filename>' for view command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "src/utils.ts" })} />);
  expect(screen.getByText("Reading utils.ts")).toBeDefined();
});

// file_manager labels
test("shows 'Renaming to <newFilename>' for rename command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" })} />);
  expect(screen.getByText("Renaming to New.tsx")).toBeDefined();
});

test("shows 'Deleting <filename>' for delete command", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "delete", path: "src/Unused.tsx" })} />);
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

// In-progress state
test("shows label while in progress (call state)", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "src/Form.tsx" }, "call")} />);
  expect(screen.getByText("Creating Form.tsx")).toBeDefined();
});

// Nested path — only filename shown
test("extracts filename from nested path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "src/components/ui/Badge.tsx" })} />);
  expect(screen.getByText("Editing Badge.tsx")).toBeDefined();
});
