import { useState, useRef, useEffect } from "react";
import api from "../../shared/utils/api";
import type { Product } from "../../types/Product";
import ProductCard from "../Products/ProductCard";

// Matches what /api/ai/chat actually returns
type AiProduct = {
  id: number;
  name: string;
  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrls: string[];
  categoryId: number;
  categoryName: string;
  status: string;
  isFeatured: boolean;
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: AiProduct[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ShopEase AI 🛍️ — powered by GPT-4o. Tell me what you're looking for and I'll find the best products for you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || loading) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(1)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await api.post("/ai/chat", { message, history });
      const { text, products } = response.data as {
        text: string;
        products: AiProduct[];
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text,
          products: products?.length > 0 ? products : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm ShopEase AI 🛍️ — powered by GPT-4o. Tell me what you're looking for and I'll find the best products for you!",
      },
    ]);
    setInput("");
  };

  const suggestions = [
    "Show me sofas under ₹20000",
    "I need a home office setup",
    "Best electronics deals",
    "Furniture under ₹10000",
  ];

  const showSuggestions = messages.length === 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="font-bold text-gray-900">ShopEase AI</h1>
            <p className="text-xs text-green-500 font-medium">
              ● Powered by GPT-4o
            </p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-yellow-400 text-gray-900 rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>

            {/* Product cards */}
            {msg.role === "assistant" &&
              msg.products &&
              msg.products.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {msg.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product as unknown as Product}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* Suggestion chips */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-sm bg-white border border-yellow-300 text-yellow-700 rounded-full px-4 py-1.5 hover:bg-yellow-50 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Loading dots */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything — 'sofas under ₹20000', 'home office setup'..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold px-5 py-2.5 rounded-xl transition text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}