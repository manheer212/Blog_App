import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  Edit,
  FileText,
  LogOut,
  Plus,
  Trash2,
  User,
  X,
} from 'lucide-react';
import './App.css';
import { authService } from './services/authService';
import { postService } from './services/postService';

const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  return fallback;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
};

const AuthPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = isLoginView ? { email, password } : { name, email, password };
      const response = isLoginView
        ? await authService.login(payload)
        : await authService.register(payload);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true');
      setAuth(true);
      navigate('/blogs');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to authenticate with those details.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <img src="/logo.webp" alt="Karol Systems Logo" className="brand-logo" />
        <div>
          <p className="brand-name">Karol Systems</p>
          <p className="brand-subtitle">Pvt. Ltd.</p>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-toggle" aria-label="Authentication mode">
          <button
            type="button"
            className={isLoginView ? 'active' : ''}
            onClick={() => {
              setError('');
              setIsLoginView(true);
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLoginView ? 'active' : ''}
            onClick={() => {
              setError('');
              setIsLoginView(false);
            }}
          >
            Register
          </button>
        </div>

        <h1 id="auth-title">{isLoginView ? 'Welcome back' : 'Create account'}</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLoginView && (
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="System Admin"
                required
              />
            </label>
          )}
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@karolsystems.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              minLength={isLoginView ? undefined : 6}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isLoginView ? 'Sign In' : 'Register Account'}
          </button>
        </form>
      </section>
    </main>
  );
};

const SidebarLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Local sign-out should still happen if the token is already invalid.
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setAuth(false);
      navigate('/login');
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.webp" alt="Karol Systems Logo" className="sidebar-logo" />
          <div>
            <p className="sidebar-name">Karol Systems</p>
            <p className="sidebar-subtitle">Pvt. Ltd.</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">Navigation</p>
          <a className="nav-item active" href="/blogs" onClick={(event) => event.preventDefault()}>
            <FileText size={18} />
            Blogs
          </a>
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <h2>Content Management</h2>
            <p>Karol Systems Admin Portal</p>
          </div>
          <div className="profile-pill">
            <span className="profile-icon">
              <User size={16} />
            </span>
            <div>
              <p>{storedUser.name || 'System Admin'}</p>
              <span>{storedUser.email || 'admin@karolsystems.com'}</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load blog records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    postService
      .getAll()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getErrorMessage(err, 'Unable to load blog records.'));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setError('');
    setIsFormModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const data = { title, content };
      if (editingPostId) {
        await postService.update(editingPostId, data);
      } else {
        await postService.create(data);
      }
      await fetchPosts();
      setIsFormModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save the blog entry.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setPostToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await postService.delete(postToDelete);
      await fetchPosts();
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete the blog entry.'));
    }
  };

  const handleDeleteAll = async () => {
    try {
      await postService.deleteAll();
      await fetchPosts();
      setIsDeleteAllModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete all blog entries.'));
    }
  };

  return (
    <section className="blogs-page">
      <div className="summary-row">
        <div className="summary-card">
          <BookOpen size={22} />
          <div>
            <strong>{posts.length}</strong>
            <span>Total Blogs</span>
          </div>
        </div>
        <div className="summary-card accent">
          <FileText size={22} />
          <div>
            <strong>{posts.length}</strong>
            <span>Published</span>
          </div>
        </div>
      </div>

      <div className="page-heading">
        <div>
          <h1>Blogs</h1>
          <p>Manage company blog records.</p>
        </div>
        <div className="page-actions">
          {posts.length > 0 && (
            <button type="button" className="danger-outline-button" onClick={() => setIsDeleteAllModalOpen(true)}>
              <Trash2 size={16} />
              Delete All
            </button>
          )}
          <button type="button" className="primary-button" onClick={openAddModal}>
            <Plus size={16} />
            Add Blog
          </button>
        </div>
      </div>

      {error && !isFormModalOpen && <p className="page-error">{error}</p>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Blog Name</th>
              <th>Blog Description</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="empty-cell">Loading blogs...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-cell">No blog records found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="blog-title">{post.title}</td>
                  <td>{post.content}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="icon-button" onClick={() => openEditModal(post)} aria-label={`Edit ${post.title}`}>
                        <Edit size={17} />
                      </button>
                      <button type="button" className="icon-button danger" onClick={() => confirmDelete(post.id)} aria-label={`Delete ${post.title}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <Modal title={editingPostId ? 'Edit Blog' : 'Add Blog'} onClose={() => setIsFormModalOpen(false)}>
          <form className="modal-form" onSubmit={handleSave}>
            <label>
              Blog Name
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter blog name" required />
            </label>
            <label>
              Blog Description
              <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Enter blog description" rows="6" required />
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setIsFormModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingPostId ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          title="Delete Blog"
          message="Are you sure you want to delete this blog?"
          confirmLabel="Yes"
          cancelLabel="No"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {isDeleteAllModalOpen && (
        <ConfirmModal
          title="Delete All Blogs"
          message="Are you sure you want to delete all blogs?"
          confirmLabel="Delete All"
          cancelLabel="Cancel"
          onCancel={() => setIsDeleteAllModalOpen(false)}
          onConfirm={handleDeleteAll}
        />
      )}
    </section>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="modal-card">
      <header className="modal-header">
        <h3 id="modal-title">{title}</h3>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
      </header>
      {children}
    </div>
  </div>
);

const ConfirmModal = ({ title, message, confirmLabel, cancelLabel, onCancel, onConfirm }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <div className="confirm-card">
      <div className="confirm-icon">
        <AlertTriangle size={28} />
      </div>
      <h3 id="confirm-title">{title}</h3>
      <p>{message}</p>
      <div className="confirm-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="danger-button" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true' && Boolean(localStorage.getItem('token')),
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage setAuth={setIsAuthenticated} />} />
        <Route
          element={
            isAuthenticated ? <SidebarLayout setAuth={setIsAuthenticated} /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/" element={<Navigate to="/blogs" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
