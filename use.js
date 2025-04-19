import React, { useState, useEffect } from 'react';
import { api } from './mockApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  // ユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await api.users.getAll();
        setUsers(userData);
        setError(null);
      } catch (err) {
        setError('ユーザーデータの取得に失敗しました: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ユーザー選択時に投稿を取得
  const handleUserSelect = async (userId) => {
    try {
      setLoading(true);
      const user = await api.users.getById(userId);
      setSelectedUser(user);
      
      const posts = await api.posts.getByUserId(userId);
      setUserPosts(posts);
      setError(null);
    } catch (err) {
      setError('ユーザー詳細の取得に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 新規ユーザー作成
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const newUser = await api.users.create({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10)
      });
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      setFormData({ name: '', email: '', age: '' });
      setError(null);
    } catch (err) {
      setError('ユーザーの作成に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // フォーム入力の処理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ユーザー削除
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await api.users.delete(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
        setUserPosts([]);
      }
      
      setError(null);
    } catch (err) {
      setError('ユーザーの削除に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // エラーシミュレーション
  const simulateApiError = async () => {
    try {
      await api.simulateError();
    } catch (err) {
      setError('API エラー: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">モックAPI テスト</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="flex gap-8">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">ユーザー一覧</h2>
          
          {loading && <p>データ読み込み中...</p>}
          
          <ul className="mb-6">
            {users.map(user => (
              <li 
                key={user.id}
                className="flex justify-between items-center p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div onClick={() => handleUserSelect(user.id)}>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({user.email})</span>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          
          <h3 className="font-semibold mb-2">新規ユーザー作成</h3>
          <form onSubmit={handleCreateUser} className="space-y-3">
            <div>
              <label className="block text-sm">名前:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm">メール:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm">年齢:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              ユーザー作成
            </button>
          </form>
          
          <button
            onClick={simulateApiError}
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded"
          >
            エラーをシミュレート
          </button>
        </div>
        
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">ユーザー詳細</h2>
          
          {selectedUser ? (
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <p><span className="font-medium">メール:</span> {selectedUser.email}</p>
              <p><span className="font-medium">年齢:</span> {selectedUser.age}歳</p>
              
              <h4 className="font-semibold mt-4 mb-2">投稿一覧</h4>
              {userPosts.length > 0 ? (
                <ul className="divide-y">
                  {userPosts.map(post => (
                    <li key={post.id} className="py-2">
                      <h5 className="font-medium">{post.title}</h5>
                      <p className="text-sm text-gray-600">{post.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">投稿がありません</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">ユーザーを選択してください</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
