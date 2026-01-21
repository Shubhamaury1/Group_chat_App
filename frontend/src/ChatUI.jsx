export default function ChatUI({
  userName,
  showNamePopup,
  inputName,
  setInputName,
  typers,
  messages,
  text,
  setText,
  handleNameSubmit,
  sendMessage,
  handleKeyDown,
}) {
  function formatTime(ts) {
    const d = new Date(ts);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 → 12
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-inter">
      {/* ENTER YOUR NAME TO START CHATTING */}
      {showNamePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-gray-100 rounded-xl shadow-lg max-w-md p-6">
            <h1 className="text-xl font-semibold text-black">
              Enter your name
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your name to start chatting. This will be used to identify
            </p>
            <form onSubmit={handleNameSubmit} className="mt-4">
              <input
                autoFocus
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-3 py-2 outline-green-700 placeholder-gray-400"
                placeholder="Your name (e.g. Rahul)"
              />
              <button
                type="submit"
                className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-700 text-white font-medium cursor-pointer"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {!showNamePopup && (
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
          {/* CHAT HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-[#ece5dd]">
            <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#303030]">
                Realtime group chat
              </div>
              {typers.length ? (
                <div className="text-xs text-gray-500">
                  {typers.join(", ")} is typing...
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="text-sm text-gray-500">
              {" "}
              <span className="font-medium text-[#303030] capitalize">
                {userName}
              </span>
            </div>
          </div>

          {/* CHAT MESSAGE LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
            {messages.map((m) => {
              const mine = m.sender === userName;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                      mine
                        ? "bg-[#DCF8C6] text-[#303030] rounded-br-2xl"
                        : "bg-white text-[#303030] rounded-bl-2xl"
                    }`}
                  >
                    <div className="break-words whitespace-pre-wrap">
                      {m.text}
                    </div>
                    <div className="flex justify-between items-center mt-1 gap-16">
                      {!mine && (
                        <div className="text-[11px] font-bold">{m.sender}</div>
                      )}

                      <div className="flex items-center gap-1 text-[11px] text-gray-500 text-right">
                        <span>{formatTime(m.ts)}</span>
                        {mine && (
                          <span className="text-blue-500 font-bold">
                            &#10003;&#10003;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHAT TEXTAREA */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full resize-none px-4 py-4 text-sm outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-6 py-4 rounded-full text-sm font-medium cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
