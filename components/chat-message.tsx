"use client"

import { Brain } from "lucide-react"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Message } from "@/lib/db"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-accent text-accent-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border border-border"
        }`}
      >
        <div className="max-w-none">
          {/**
           * Para evitar errores de tipos en TypeScript (prop 'inline' no existente
           * en HTMLAttributes), tipamos los componentes como `any` localmente.
           */}
          {(() => {
            const mdComponents: any = {
              p: (props: any) => (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" {...props} />
              ),
              strong: (props: any) => (
                <strong className="font-semibold" {...props} />
              ),
              em: (props: any) => <em className="italic" {...props} />,
              h1: (props: any) => (
                <h1 className="text-lg font-bold mt-2" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-base font-bold mt-2" {...props} />
              ),
              h3: (props: any) => (
                <h3 className="text-sm font-semibold mt-2" {...props} />
              ),
              hr: (props: any) => <hr className="my-2 border-t border-border" {...props} />,
              ul: (props: any) => (
                <ul className="list-disc ml-5" {...props} />
              ),
              ol: (props: any) => (
                <ol className="list-decimal ml-5" {...props} />
              ),
              code: (props: any) => {
                const { inline, children, ...rest } = props || {}
                return inline ? (
                  <code className="bg-muted px-1 rounded text-sm" {...rest}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-muted p-2 rounded overflow-auto">
                    <code {...rest}>{children}</code>
                  </pre>
                )
              },
            }

            return (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {message.content}
              </ReactMarkdown>
            )
          })()}
        </div>

        <span className="text-xs opacity-50 mt-2 block">
          {new Date(message.created_at).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
          U
        </div>
      )}
    </div>
  )
}
