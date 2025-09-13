export const ChatMessageSkeleton = ({ fromSelf }) => {
  return (
    <div className={`flex ${fromSelf ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className="rounded-2xl p-3 max-w-[65%] shadow-md relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      >
        <div className="h-0.5 w-32 mb-2 rounded bg-transparent"></div>
        <div className="h-0.5 w-24 rounded bg-transparent"></div>
      </div>
    </div>
  );
};
