"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

/**
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback function when form is submitted
 */
export function CreateTodo({ onSubmit }) {
  const [newTodo, setNewTodo] = useState({ title: "", description: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newTodo)
    setNewTodo({ title: "", description: "" })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>新しいタスク</CardTitle>
          <CardDescription>新しいタスクを作成します。タイトルは必須です。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="タスクのタイトル"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="タスクの詳細（任意）"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            タスクを追加
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

