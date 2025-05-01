import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { tasks } from '../../services/api';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Quote {
  text: string;
  author: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const config = {
  apiUrl: import.meta.env.VITE_QUOTES_API_URL,
  apiKey: import.meta.env.VITE_QUOTES_API_KEY
};

const Dashboard: React.FC = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });
  const toast = useToast();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasks.getAll(pagination.page, pagination.limit);
      if (response?.data) {
        setTasksList(response.data.data || []);
        setPagination({
          total: response.data.meta?.total || 0,
          page: response.data.meta?.page || 1,
          limit: response.data.meta?.limit || 10,
          totalPages: response.data.meta?.totalPages || 0,
        });
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        toast({
          title: 'Request timeout',
          description: 'Please check your internet connection',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (!error.response) {
        toast({
          title: 'Network error',
          description: 'Please check your internet connection',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (error.response?.status === 401) {
        // Only logout on 401 Unauthorized
        // clearAuth();
        // window.location.href = '/login';
      } else {
        toast({
          title: 'Error fetching tasks',
          description: error.response?.data?.error || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setTasksList([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    }
  }, [pagination.page, pagination.limit, toast]);

  const fetchQuote = useCallback(async () => {
    try {
      const response = await axios.get(config.apiUrl, {
        headers: {
          'X-Api-Key': config.apiKey
        }
      });
      const quoteData = response.data[0];
      setQuote({
        text: quoteData.quote,
        author: quoteData.author
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast({
        title: 'Error fetching quote',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
    fetchQuote();

    const intervalId = setInterval(() => {
      fetchQuote();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchQuote, fetchTasks]);

  const handleCreateTask = async () => {
    try {
      await tasks.create(newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
      toast({
        title: 'Task created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await tasks.update(task.id, task);
      fetchTasks();
      toast({
        title: 'Task updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await tasks.delete(id);
      fetchTasks();
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todo List Section */}
          <div className="space-y-4">
            <div className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCreateTask}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Task
              </button>
            </div>

            <div className="space-y-4">
              {tasksList?.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl shadow-sm border ${
                    task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleUpdateTask({ ...task, completed: !task.completed })}
                        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`text-lg font-medium ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="mt-2 text-gray-600">{task.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Quote Section */}
          <div className="sticky top-8">
            {quote && (
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-between w-full mb-6">
                    <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <button
                      onClick={fetchQuote}
                      className="p-2 text-blue-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                      title="Get new quote"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-2xl sm:text-3xl italic text-gray-800 leading-relaxed font-serif">"{quote.text}"</p>
                  <p className="mt-6 text-gray-600 font-medium text-lg">- {quote.author}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateTask(editingTask);
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 