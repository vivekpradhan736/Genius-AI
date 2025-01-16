import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Grid, MoreHorizontal, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, isToday, isYesterday, isWithinInterval, startOfToday, subDays } from "date-fns";

// Type for a single conversation
interface Conversation {
  id: string;
  conversationName: string;
  createdAt: string; // Use Date if already converted
}

// Props for ChatSidebar
interface ChatSidebarProps {
  allConversation: Conversation[];
  allConversationLoading: boolean;
  createConversation: () => void;
  chatId?: string;
}

export default function ChatSidebar({
  allConversation,
  allConversationLoading,
  createConversation,
  chatId,
}: ChatSidebarProps) {
  const router = useRouter();

  // Function to format dates
  const getDateLabel = (date: Date) => {
    const today = startOfToday();

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    if (isWithinInterval(date, { start: subDays(today, 7), end: today })) {
      return "Previous 7 Days";
    }

    if (isWithinInterval(date, { start: subDays(today, 30), end: today })) {
      return "Previous 30 Days";
    }

    if (date.getMonth() === today.getMonth() - 1 || (today.getMonth() === 0 && date.getMonth() === 11)) {
      return "Last Month";
    }

    return format(date, "MMM dd, yyyy");
  };

  // Ensure allConversation is an array before reducing
const conversationsArray = Array.isArray(allConversation) ? allConversation : [];

// Group conversations by their creation date
const groupedConversations = conversationsArray.reduce<Record<string, Conversation[]>>(
  (groups, conversation) => {
    const dateLabel = getDateLabel(new Date(conversation.createdAt));
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(conversation);
    return groups;
  },
  {}
);

  return (
    <div className="w-64 h-[94vh] bg-white text-black font-medium p-4 flex flex-col border-l-2">
      <div className="flex justify-between mb-4">
        <button className="p-2 hover:bg-gray-200 rounded">
          <Bot className="h-5 w-5" />
        </button>
        <button title="New Chat" onClick={createConversation} className="p-2 hover:bg-gray-200 rounded">
          <SquarePen className="h-5 w-5 stroke-[2px]" />
        </button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-4">
          <SidebarSection title="Pinned">
            <button
              title="New Chat"
              onClick={createConversation}
              className="flex justify-between items-center w-full group px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              <div className="flex">
                <span className="mr-3">
                  <Bot className="h-5 w-5" />
                </span>
                <span className="truncate">Genius - AI</span>
              </div>
              <span className="mr-3 text-gray-600 hidden group-hover:block hover:text-black">
                <SquarePen className="h-5 w-5 stroke-[2px]" />
              </span>
            </button>
            <SidebarItem icon={<Grid className="h-5 w-5" />} label="Explore More Model" />
          </SidebarSection>
          <Separator className="bg-zinc-700" />

          {/* Render each date group with conversations */}
          {allConversationLoading ? (
            <div>Loading...</div>
          ) : (
            Object.keys(groupedConversations).map((dateLabel) => (
              <SidebarSection title={dateLabel} key={dateLabel}>
                {groupedConversations[dateLabel].map((conv) => (
                  <button
                    className={`flex items-center justify-between w-full group px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                      chatId === conv.id ? "bg-gray-200" : ""
                    }`}
                    key={conv.id}
                    onClick={() => router.push(`/conversation/${conv.id}`)}
                  >
                    <span className="truncate">{conv.conversationName}</span>
                    <span
                      className={`mr-3 text-gray-600 group-hover:block hover:text-black ${
                        chatId === conv.id ? "block" : "hidden"
                      }`}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </span>
                  </button>
                ))}
              </SidebarSection>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-semibold text-zinc-400 mb-2">{title}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center w-full px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors">
      {icon && <span className="mr-3">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
}
