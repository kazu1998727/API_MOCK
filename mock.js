// mockData.js - モックデータを定義
export const users = [
  { id: 1, name: "田中太郎", email: "tanaka@example.com", age: 28 },
  { id: 2, name: "佐藤花子", email: "sato@example.com", age: 32 },
  { id: 3, name: "山田一郎", email: "yamada@example.com", age: 45 },
  { id: 4, name: "鈴木美香", email: "suzuki@example.com", age: 23 },
  { id: 5, name: "高橋健太", email: "takahashi@example.com", age: 37 }
];

export const posts = [
  { id: 1, userId: 1, title: "Reactの基本", body: "Reactコンポーネントの作り方について" },
  { id: 2, userId: 1, title: "Hooksの使い方", body: "useState、useEffectなどの解説" },
  { id: 3, userId: 2, title: "CSSテクニック", body: "モダンなレイアウトの実装方法" },
  { id: 4, userId: 3, title: "状態管理入門", body: "ReduxとContext APIの比較" },
  { id: 5, userId: 4, title: "API連携のベストプラクティス", body: "フロントエンドからのデータ取得テクニック" }
];

export const comments = [
  { id: 1, postId: 1, name: "匿名ユーザー", body: "とても参考になりました！" },
  { id: 2, postId: 1, name: "React初心者", body: "もう少し詳しく説明してほしいです" },
  { id: 3, postId: 2, name: "開発者A", body: "カスタムフックについても知りたいです" },
  { id: 4, postId: 3, name: "デザイナー", body: "素晴らしい記事ですね" },
  { id: 5, postId: 5, name: "バックエンド開発者", body: "フロントとバックの連携について補足します" }
];

// mockApi.js - モックAPIを実装
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // ユーザー関連API
  users: {
    // 全ユーザー取得
    getAll: async () => {
      await delay(500); // リアルなネットワーク遅延をシミュレート
      return [...users];
    },
    
    // IDによるユーザー取得
    getById: async (id) => {
      await delay(300);
      const user = users.find(user => user.id === id);
      if (!user) throw new Error('User not found');
      return { ...user };
    },
    
    // ユーザー作成
    create: async (userData) => {
      await delay(700);
      const newUser = {
        id: users.length + 1,
        ...userData
      };
      users.push(newUser);
      return { ...newUser };
    },
    
    // ユーザー更新
    update: async (id, userData) => {
      await delay(500);
      const index = users.findIndex(user => user.id === id);
      if (index === -1) throw new Error('User not found');
      
      const updatedUser = { ...users[index], ...userData };
      users[index] = updatedUser;
      return { ...updatedUser };
    },
    
    // ユーザー削除
    delete: async (id) => {
      await delay(600);
      const index = users.findIndex(user => user.id === id);
      if (index === -1) throw new Error('User not found');
      
      const deletedUser = users[index];
      users.splice(index, 1);
      return { ...deletedUser };
    }
  },
  
  // 投稿関連API
  posts: {
    // 全投稿取得
    getAll: async () => {
      await delay(600);
      return [...posts];
    },
    
    // IDによる投稿取得
    getById: async (id) => {
      await delay(400);
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error('Post not found');
      return { ...post };
    },
    
    // ユーザーIDによる投稿取得
    getByUserId: async (userId) => {
      await delay(500);
      const userPosts = posts.filter(post => post.userId === userId);
      return [...userPosts];
    },
    
    // 投稿作成
    create: async (postData) => {
      await delay(800);
      const newPost = {
        id: posts.length + 1,
        ...postData
      };
      posts.push(newPost);
      return { ...newPost };
    }
  },
  
  // コメント関連API
  comments: {
    // 投稿IDによるコメント取得
    getByPostId: async (postId) => {
      await delay(400);
      const postComments = comments.filter(comment => comment.postId === postId);
      return [...postComments];
    },
    
    // コメント追加
    create: async (commentData) => {
      await delay(500);
      const newComment = {
        id: comments.length + 1,
        ...commentData
      };
      comments.push(newComment);
      return { ...newComment };
    }
  },
  
  // エラーをシミュレートするメソッド
  simulateError: async () => {
    await delay(300);
    throw new Error('API Error: Something went wrong');
  },
  
  // ネットワークタイムアウトをシミュレート
  simulateTimeout: async () => {
    await delay(5000);
    return { message: 'This response was delayed' };
  }
};
