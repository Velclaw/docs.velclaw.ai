'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import { useChat } from 'ai/react';

export function LiveEditor({ initialCode }: { initialCode: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' });
  return <section className="live-editor" aria-label="Live React editor and AI assistant"><Sandpack template="react" theme="dark" files={{ '/App.js': initialCode }} customSetup={{ entry: '/App.js' }} options={{ editorHeight: 430, showNavigator: false, showTabs: false }} /><div className="assistant"><strong>AI Code Assistant</strong><div className="messages" aria-live="polite">{messages.length === 0 ? <p>Hỏi AI về đoạn code đang thực hành.</p> : messages.map((message) => <div className={`message ${message.role}`} key={message.id}><b>{message.role === 'user' ? 'Bạn' : 'AI'}: </b>{message.content}</div>)}</div><form className="chat-form" onSubmit={handleSubmit}><input value={input} onChange={handleInputChange} disabled={isLoading} maxLength={4000} placeholder="Hỏi AI về đoạn code này..." aria-label="Câu hỏi cho trợ lý AI" /><button type="submit" disabled={isLoading}>{isLoading ? 'Đang phân tích…' : 'Gửi'}</button></form></div></section>;
}
