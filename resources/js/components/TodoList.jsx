import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('/api/todos');
            setTodos(response.data);
            setLoading(false);
        } catch (err) {
            setError('TODOの取得に失敗しました');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/todos', newTodo);
            setTodos([response.data, ...todos]);
            setNewTodo({ title: '', description: '' });
        } catch (err) {
            setError('TODOの作成に失敗しました');
        }
    };

    const toggleComplete = async (todo) => {
        try {
            const response = await axios.put(`/api/todos/${todo.id}`, {
                completed: !todo.completed_at
            });
            const updatedTodos = todos.map(t => 
                t.id === todo.id ? response.data : t
            );
            setTodos(updatedTodos);
        } catch (err) {
            setError('TODOの更新に失敗しました');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`/api/todos/${id}`);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('TODOの削除に失敗しました');
        }
    };

    if (loading) return <div>読み込み中...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="タイトル"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="説明"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    追加
                </button>
            </form>

            <div className="space-y-4">
                {todos.map(todo => (
                    <div key={todo.id} className="border p-4 rounded flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={!!todo.completed_at}
                                onChange={() => toggleComplete(todo)}
                                className="h-4 w-4"
                            />
                            <div>
                                <h3 className={`font-bold ${todo.completed_at ? 'line-through' : ''}`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className="text-gray-600">{todo.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 