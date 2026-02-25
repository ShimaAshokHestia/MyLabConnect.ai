import React, { useState, useRef, useEffect } from 'react';
import './CommunicationPanel.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type MessageSide = 'lab' | 'doc';

export interface ChatMessage {
  id: string;
  side: MessageSide;
  sender: string;
  text: string;
  time: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  meta: string;
}

export interface CommunicationPanelProps {
  /** Initial chat messages */
  initialMessages?: ChatMessage[];
  /** File attachments shown in Files tab */
  files?: FileAttachment[];
  /** Called when a new message is sent */
  onSend?: (message: string) => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Default data
// ─────────────────────────────────────────────

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    side: 'lab',
    sender: 'Lab · MYLAB',
    text: 'Shade missing, kindly let me know the shade details for manufacturing.',
    time: '09:14',
  },
];

const DEFAULT_FILES: FileAttachment[] = [
  {
    id: '1',
    name: 'iTero_Export_155178278.zip',
    meta: 'IOS scan · 7.84 MB',
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const SendIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FileBoxIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const KiduCaseChat: React.FC<CommunicationPanelProps> = ({
  initialMessages = DEFAULT_MESSAGES,
  files = DEFAULT_FILES,
  onSend,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'files'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      side: 'doc',
      sender: 'You',
      text,
      time,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    onSend?.(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={`comm-panel ${className}`} role="region" aria-label="Communication panel">
      {/* Header */}
      <div className="comm-header">
        <span className="comm-title">Communication</span>
        <div className="online-dot" title="Lab online" aria-label="Lab online" />
      </div>

      {/* Tabs */}
      <div className="comm-tabs" role="tablist">
        <button
          className={`comm-tab${activeTab === 'chat' ? ' active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`comm-tab${activeTab === 'files' ? ' active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
        >
          Files
        </button>
      </div>

      {/* Chat area */}
      {activeTab === 'chat' && (
        <div className="chat-area" role="log" aria-live="polite" aria-label="Chat messages">
          <div className="date-divider">
            <span>Today</span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-msg ${msg.side}`}
              role="article"
              aria-label={`${msg.sender}: ${msg.text}`}
            >
              <span className="msg-sender">{msg.sender}</span>
              <div className="msg-bubble">{msg.text}</div>
              <span className="msg-time">{msg.time}</span>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* Files panel */}
      {activeTab === 'files' && (
        <div className="files-panel" role="list" aria-label="Attached files">
          {files.map((file) => (
            <div key={file.id} className="file-item" role="listitem">
              <div className="file-icon">
                <FileBoxIcon />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="file-name">{file.name}</div>
                <div className="file-meta">{file.meta}</div>
              </div>
              <div className="file-dl" title="Download" aria-label={`Download ${file.name}`}>
                <DownloadIcon />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-wrap">
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type a message"
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim()}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default KiduCaseChat;

// ─────────────────────────────────────────────
// Usage Example
// ─────────────────────────────────────────────
//
// import CommunicationPanel, { ChatMessage, FileAttachment } from './CommunicationPanel';
//
// const messages: ChatMessage[] = [
//   { id: '1', side: 'lab', sender: 'Lab · MYLAB',
//     text: 'Shade missing, kindly let me know the shade details for manufacturing.',
//     time: '09:14' },
// ];
//
// const files: FileAttachment[] = [
//   { id: '1', name: 'iTero_Export_155178278.zip', meta: 'IOS scan · 7.84 MB' },
// ];
//
// <CommunicationPanel
//   initialMessages={messages}
//   files={files}
//   onSend={(msg) => console.log('Sent:', msg)}
// />