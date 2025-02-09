"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { CreateTodo } from "../components/create-todo"
import { TodoItem } from "../components/todo-item"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos")
      setTodos(response.data)
      setLoading(false)
    } catch (err) {
      setError("TODOの取得に失敗しました")
      setLoading(false)
    }
  }

  const handleSubmit = async (newTodo) => {
    try {
      const response = await axios.post("/api/todos", newTodo)
      setTodos([response.data, ...todos])
      toast({
        title: "タスクを作成しました",
        description: "新しいタスクが追加されました。",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タスクの作成に失敗しました。",
      })
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const response = await axios.put(`/api/todos/${todo.id}`, {
        completed: !todo.completed_at,
      })
      const updatedTodos = todos.map((t) => (t.id === todo.id ? response.data : t))
      setTodos(updatedTodos)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タスクの更新に失敗しました。",
      })
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "タスクを削除しました",
        description: "タスクが正常に削除されました。",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タスクの削除に失敗しました。",
      })
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background p-4 transition-colors duration-200`}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">タスク管理</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-[400px_1fr]">
          <div className="md:sticky md:top-4 md:h-fit">
            <CreateTodo onSubmit={handleSubmit} />
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onDelete={deleteTodo} />
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                タスクがありません。新しいタスクを追加してください。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

