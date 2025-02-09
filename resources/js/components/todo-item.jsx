"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * @param {Object} props
 * @param {Object} props.todo - Todo item object
 * @param {number} props.todo.id - Todo ID
 * @param {string} props.todo.title - Todo title
 * @param {string} [props.todo.description] - Todo description
 * @param {string|null} props.todo.completed_at - Completion timestamp
 * @param {Function} props.onToggle - Toggle completion callback
 * @param {Function} props.onDelete - Delete todo callback
 */
export function TodoItem({ todo, onToggle, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <Checkbox checked={!!todo.completed_at} onCheckedChange={() => onToggle(todo)} className="mt-1" />
        <div className="flex-1 space-y-1">
          <h3
            className={cn(
              "text-lg font-medium leading-none tracking-tight",
              todo.completed_at && "text-muted-foreground line-through",
            )}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className={cn("text-sm text-muted-foreground", todo.completed_at && "line-through")}>
              {todo.description}
            </p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="flex items-center gap-2"
        >
          <Button variant="destructive" size="icon" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

