import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { LogOut, Edit, Trash2, Plus, AlertTriangle, LayoutDashboard, FileText, User, X, BookOpen } from 'lucide-react';
import { postService } from './services/postService';

// ==========================================
// 1. PUBLIC AUTHENTICATION PAGE (Login & Register)
// ==========================================
const AuthPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      setAuth(true);
      navigate('/blogs');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* 🚀 TRUE SINGLE-LINE HEADER */}
      <header className="bg-white border-b border-slate-200 h-16 w-full flex flex-row items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10 shadow-sm overflow-hidden">
        <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
          <img src="/logo.webp" alt="Karol Systems Logo" className="h-8 w-8 object-contain flex-shrink-0" />
          <span className="text-slate-900 text-base sm:text-lg font-bold tracking-wide whitespace-nowrap">
            Karol Systems
          </span>
        </div>
        
        <div className="flex flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
          <button 
            onClick={() => setIsLoginView(true)} 
            className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              isLoginView 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLoginView(false)} 
            className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              !isLoginView 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
            }`}
          >
            Register
          </button>
        </div>
      </header>

      {/* 📝 Centered Card Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {isLoginView ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {isLoginView 
                ? 'Enter your credentials to access your portal.' 
                : 'Sign up to start managing your company digital content.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-slate-50 focus:bg-white"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="admin@karolsystems.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-slate-50 focus:bg-white"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-blue-200 mt-2 text-sm"
            >
              {isLoginView ? 'Sign In' : 'Register Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SIDEBAR LAYOUT
// ==========================================
const SidebarLayout = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-5 border-b border-slate-700/60">
          <img src="/logo.webp" alt="Logo" className="w-8 h-8 object-contain mr-2.5 rounded-lg bg-white/10 p-1" />
          <div>
            <p className="text-white text-sm font-bold leading-tight">Karol Systems</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Pvt. Ltd.</p>
          </div>
        </div>

        <div className="flex-1 py-5 px-3 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Navigation</p>
          <div className="flex items-center gap-3 bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer font-semibold text-sm">
            <FileText className="w-4 h-4" />
            Blogs
          </div>
          <div className="flex items-center gap-3 text-slate-500 px-3 py-2.5 rounded-lg cursor-not-allowed font-medium text-sm opacity-50">
            <LayoutDashboard className="w-4 h-4" />
            Analytics
            <span className="ml-auto text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Soon</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">Content Management</h2>
            <p className="text-xs text-slate-400">Karol Systems — Admin Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 border border-blue-100 p-1.5 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-bold text-slate-800 leading-none text-xs">System Admin</p>
              <p className="text-slate-400 mt-0.5 text-xs">admin@karolsystems.com</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ==========================================
// 3. BLOGS PAGE & TABLE COMPONENT
// ==========================================
const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => {
    postService.getAll().then(data => setPosts(data)).catch(err => console.error(err));
  };

  const openAddModal = () => {
    setEditingPostId(null); setTitle(''); setContent(''); setIsFormModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPostId(post.id); setTitle(post.title); setContent(post.content); setIsFormModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = { title, content };
    const request = editingPostId ? postService.update(editingPostId, data) : postService.create(data);
    request.then(() => { fetchPosts(); setIsFormModalOpen(false); }).catch(err => console.error(err));
  };

  const confirmDelete = (id) => { setPostToDelete(id); setIsDeleteModalOpen(true); };

  const handleDelete = () => {
    postService.delete(postToDelete).then(() => { fetchPosts(); setIsDeleteModalOpen(false); });
  };

  const handleDeleteAll = () => {
    if (postService.deleteAll) {
      postService.deleteAll().then(() => { fetchPosts(); setIsDeleteAllModalOpen(false); });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="bg-blue-50 p-2.5 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{posts.length}</p><p className="text-xs text-slate-500 font-medium">Total Blogs</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="bg-emerald-50 p-2.5 rounded-lg"><FileText className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{posts.length}</p><p className="text-xs text-slate-500 font-medium">Published</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="bg-violet-50 p-2.5 rounded-lg"><User className="w-5 h-5 text-violet-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">1</p><p className="text-xs text-slate-500 font-medium">Author</p></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Blogs Directory</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create, manage, and publish company articles.</p>
        </div>
        <div className="flex gap-3">
          {posts.length > 0 && (
            <button onClick={() => setIsDeleteAllModalOpen(true)} className="px-4 py-2 bg-white border border-red-200 text-red-500 font-semibold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-sm">Delete All</button>
          )}
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md shadow-blue-200 text-sm">
            <Plus className="w-4 h-4" /> Add Blog
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Blog Name</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Blog Description</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-slate-100 rounded-full p-4 mb-2"><FileText className="w-8 h-8 text-slate-400" /></div>
                      <p className="text-slate-700 font-semibold">No blogs yet</p>
                      <p className="text-slate-400 text-sm">Click "Add Blog" to publish your first article.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-6 align-middle w-1/4 font-bold text-slate-900 text-sm">{post.title}</td>
                    <td className="py-4 px-6 align-middle">
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {post.content.length > 120 ? post.content.substring(0, 120) + '…' : post.content}
                      </p>
                    </td>
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="flex justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(post)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete(post.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div><h3 className="text-base font-bold text-slate-900">{editingPostId ? 'Edit Blog' : 'Create New Blog'}</h3></div>
              <button onClick={() => setIsFormModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Blog Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 text-sm bg-slate-50 focus:bg-white" placeholder="Enter title" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
                <textarea required rows="6" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y text-slate-900 text-sm bg-slate-50 focus:bg-white" placeholder="Write content..." />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-200">{editingPostId ? 'Save Changes' : 'Publish Blog'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4"><Trash2 className="h-7 w-7 text-red-600" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Blog?</h3>
            <p className="text-sm text-slate-500 mb-7">Are you sure you want to delete this blog?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-sm">No</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md shadow-red-200">Yes</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 text-center border-t-4 border-red-500">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4"><AlertTriangle className="h-7 w-7 text-red-600" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Clear All Blogs?</h3>
            <p className="text-sm text-slate-500 mb-7">You are about to permanently delete all blog records. This cannot be reversed.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteAllModalOpen(false)} className="flex-1 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-sm">Cancel</button>
              <button onClick={handleDeleteAll} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md shadow-red-200">Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN ROUTER
// ==========================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage setAuth={setIsAuthenticated} />} />
        <Route element={isAuthenticated ? <SidebarLayout setAuth={setIsAuthenticated} /> : <Navigate to="/login" />}>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/" element={<Navigate to="/blogs" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;