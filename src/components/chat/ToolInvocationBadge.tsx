import { Loader2, FilePlus, FilePen, Trash2, RefreshCw, FileSearch } from "lucide-react";
import type { ToolInvocation } from "ai";

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path.split("/").pop() : null;
  const filename = path || "file";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
      case "undo_edit":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      default:
        return `Editing ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    if (args.command === "rename") {
      const newFilename =
        typeof args.new_path === "string" ? args.new_path.split("/").pop() : null;
      return newFilename ? `Renaming to ${newFilename}` : `Renaming ${filename}`;
    }
    if (args.command === "delete") {
      return `Deleting ${filename}`;
    }
  }

  return filename;
}

function getIcon(toolName: string, args: Record<string, unknown>, done: boolean) {
  const cls = "w-3.5 h-3.5";

  if (!done) {
    return <Loader2 className={`${cls} animate-spin text-blue-500`} />;
  }

  if (toolName === "str_replace_editor") {
    if (args.command === "create") return <FilePlus className={`${cls} text-emerald-500`} />;
    if (args.command === "view") return <FileSearch className={`${cls} text-neutral-400`} />;
    return <FilePen className={`${cls} text-blue-500`} />;
  }

  if (toolName === "file_manager") {
    if (args.command === "delete") return <Trash2 className={`${cls} text-red-400`} />;
    return <RefreshCw className={`${cls} text-amber-500`} />;
  }

  return <FilePen className={`${cls} text-neutral-400`} />;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const { toolName, args, state } = toolInvocation;
  const done = state === "result";
  const label = getLabel(toolName, args as Record<string, unknown>);
  const icon = getIcon(toolName, args as Record<string, unknown>, done);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {icon}
      <span className="text-neutral-600">{label}</span>
    </div>
  );
}
