import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2, Heart, MessageSquare, Send, X, Image as ImageIcon, Search } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export function GuidesPanel() {
  const { guides, currentUser, addGuide, updateGuide, deleteGuide, toggleGuideLike } = useStore();
  const isAdmin = currentUser?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guides.filter(guide => {
    const query = searchQuery.toLowerCase();
    return guide.title.toLowerCase().includes(query) || guide.content.toLowerCase().includes(query);
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (editId) {
      updateGuide(editId, { title, content });
    } else {
      addGuide({
        title,
        content,
        authorId: currentUser!.id,
        authorName: currentUser!.name,
      });
    }
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setContent('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    let imagePasted = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        imagePasted = true;
        const file = items[i].getAsFile();
        if (!file) continue;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            document.execCommand('insertImage', false, dataUrl);
            if (editorRef.current) setContent(editorRef.current.innerHTML);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    // If it's just text, let it paste naturally
  };

  const editorRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [editId]);

  const startEdit = (guide: any) => {
    setEditId(guide.id);
    setTitle(guide.title);
    setContent(guide.content);
    setIsEditing(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Гайды</h1>
            {isAdmin && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={18} />
                <span>Написать гайд</span>
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по гайдам..."
                className="w-full bg-[#252526] border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-500"
              />
            </div>
          )}

          {isEditing && (
            <div className="bg-[#252526] border border-neutral-700 rounded-xl p-6 shadow-xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{editId ? 'Редактировать гайд' : 'Новый гайд'}</h2>
                <button onClick={() => { setIsEditing(false); setEditId(null); setTitle(''); setContent(''); }} className="text-neutral-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Заголовок..."
                className="w-full bg-transparent border-b border-neutral-700 pb-2 text-2xl font-bold text-white outline-none mb-4 focus:border-blue-500 transition-colors"
              />
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-700 p-2 mb-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-2 text-neutral-400">
                  <button className="p-1 hover:text-white hover:bg-neutral-800 rounded flex gap-2 items-center text-sm px-2" onClick={() => {
                    const url = prompt("Введите URL картинки:");
                    if (url) {
                      document.execCommand('insertImage', false, url);
                      if (editorRef.current) setContent(editorRef.current.innerHTML);
                    }
                  }}>
                    <ImageIcon size={16} /> Картинка
                  </button>
                  <span className="text-xs text-neutral-500 ml-auto">Редактор с поддержкой картинок</span>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={e => setContent(e.currentTarget.innerHTML)}
                  onPaste={handlePaste}
                  data-placeholder="Содержание гайда... Можно вставлять картинки (Ctrl+V)."
                  className="w-full min-h-[16rem] bg-transparent outline-none text-neutral-200 custom-scrollbar overflow-y-auto prose prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-500 cursor-text"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Опубликовать
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {filteredGuides.length === 0 ? (
              <div className="text-center text-neutral-500 py-12">
                {searchQuery ? 'Гайды не найдены по вашему запросу.' : `Гайдов пока нет. ${isAdmin ? 'Напишите первый!' : ''}`}
              </div>
            ) : (
              filteredGuides.map(guide => (
                <GuidePost key={guide.id} guide={guide} isAdmin={isAdmin} onEdit={() => startEdit(guide)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidePost({ guide, isAdmin, onEdit }: { key?: string, guide: any, isAdmin: boolean, onEdit: () => void }) {
  const { currentUser, toggleGuideLike, deleteGuide, allUsers } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const isLiked = currentUser && guide.likes.includes(currentUser.id);
  const likedByNames = guide.likes.map((id: string) => allUsers.find(u => u.id === id)?.name || 'Неизвестный');

  // We parse markdown simply for backward compatibility, but allow HTML since the new editor uses contentEditable
  const formatContent = (text: string) => {
    if (!text) return '';
    let html = text;
      
    // Images: ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4 max-h-[500px] object-contain cursor-pointer hover:opacity-90 transition-opacity" loading="lazy" />');
    
    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:underline">$1</a>');
    
    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // If it doesn't look like HTML from contentEditable, convert line breaks
    if (!html.includes('<div') && !html.includes('<p>') && !html.includes('<br')) {
      html = html.replace(/\n/g, '<br />');
    }

    // Add cursor-pointer class to all images
    html = html.replace(/<img /g, '<img class="cursor-pointer hover:opacity-90 transition-opacity max-w-full rounded-lg my-2" ');

    return html;
  };

  return (
    <article className="bg-[#252526] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{guide.title}</h2>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span className="text-blue-400 font-medium">{guide.authorName}</span>
              <span>•</span>
              <span>{new Date(guide.createdAt || Date.now()).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="p-2 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => deleteGuide(guide.id)}
                className="p-2 hover:bg-red-900/30 rounded-md text-neutral-400 hover:text-red-400 transition-colors"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div 
          className="text-neutral-300 leading-relaxed text-base prose-invert max-w-none guide-content"
          dangerouslySetInnerHTML={{ __html: formatContent(guide.content) }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
              setZoomedImage((target as HTMLImageElement).src);
            }
          }}
        />

      </div>

      <div className="px-6 py-4 border-t border-neutral-800 bg-[#1e1e1e]/50 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => currentUser && toggleGuideLike(guide.id, currentUser.id)}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-pink-500' : 'text-neutral-400 hover:text-pink-500'}`}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            <span className="font-medium">{guide.likes.length}</span>
          </button>
          {likedByNames.length > 0 && (
            <span 
              className="text-xs text-neutral-500 hidden sm:inline-block max-w-[200px] md:max-w-[300px] truncate cursor-help" 
              title={likedByNames.join(', ')}
            >
              {likedByNames.join(', ')}
            </span>
          )}
        </div>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <MessageSquare size={20} />
          <span className="font-medium">Комментарии</span>
        </button>
      </div>

      {showComments && (
        <CommentsSection guideId={guide.id} />
      )}

      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
          <button 
            className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </article>
  );
}

function CommentsSection({ guideId }: { guideId: string }) {
  const { currentUser, allUsers } = useStore();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'guide_comments'), 
      where('guideId', '==', guideId)
    );
    const unsub = onSnapshot(q, (snap) => {
      // client-side sort since we might not have a composite index right away
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }) as any);
      docs.sort((a, b) => a.createdAt - b.createdAt);
      setComments(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [guideId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    try {
      await addDoc(collection(db, 'guide_comments'), {
        guideId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: newComment.trim(),
        createdAt: Date.now() // Use client timestamp for simple sort
      });
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'guide_comments', id));
  };

  const handleLikeComment = async (commentId: string, currentLikes: string[] = []) => {
    if (!currentUser) return;
    const isLiked = currentLikes.includes(currentUser.id);
    const newLikes = isLiked 
      ? currentLikes.filter(id => id !== currentUser.id)
      : [...currentLikes, currentUser.id];
    await updateDoc(doc(db, 'guide_comments', commentId), { likes: newLikes });
  };

  const startEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;
    await updateDoc(doc(db, 'guide_comments', commentId), {
      content: editingCommentContent.trim()
    });
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  return (
    <div className="bg-[#181818] px-6 py-6 border-t border-neutral-800">
      <div className="space-y-6 mb-6">
        {loading ? (
          <div className="text-neutral-500 text-sm">Загрузка комментариев...</div>
        ) : comments.length === 0 ? (
          <div className="text-neutral-500 text-sm">Нет комментариев. Напишите первый!</div>
        ) : (
          comments.map(c => {
            const commentLikes = c.likes || [];
            const isCommentLiked = currentUser && commentLikes.includes(currentUser.id);
            const commentLikedByNames = commentLikes.map((id: string) => allUsers.find(u => u.id === id)?.name || 'Неизвестный');

            return (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
                  {c.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{c.authorName}</span>
                    <span className="text-xs text-neutral-500">{new Date(c.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                  {editingCommentId === c.id ? (
                    <div className="mt-2 mb-3 pr-8">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="w-full bg-[#2a2d2e] text-white rounded-lg p-3 text-sm outline-none border border-neutral-700 focus:border-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => { setEditingCommentId(null); setEditingCommentContent(''); }}
                          className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                        >
                          Отмена
                        </button>
                        <button 
                          onClick={() => handleSaveEditComment(c.id)}
                          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-neutral-300 text-sm whitespace-pre-wrap mb-2">
                      {c.content}
                    </div>
                  )}
                  {editingCommentId !== c.id && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLikeComment(c.id, commentLikes)}
                        className={`flex items-center gap-1.5 transition-colors ${isCommentLiked ? 'text-pink-500' : 'text-neutral-500 hover:text-pink-500'}`}
                        title={commentLikedByNames.length > 0 ? `Лайкнули: ${commentLikedByNames.join(', ')}` : 'Оценить'}
                      >
                        <Heart size={14} className={isCommentLiked ? 'fill-current' : ''} />
                        {commentLikes.length > 0 && <span className="text-xs font-medium">{commentLikes.length}</span>}
                      </button>
                      {commentLikedByNames.length > 0 && (
                        <span className="text-xs text-neutral-600 hidden sm:inline-block cursor-help" title={commentLikedByNames.join(', ')}>
                          {commentLikedByNames.slice(0, 3).join(', ')}{commentLikedByNames.length > 3 ? '...' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {(currentUser?.role === 'admin' || currentUser?.id === c.authorId) && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 self-start">
                    {currentUser?.id === c.authorId && (
                      <button 
                        onClick={() => startEditComment(c)}
                        className="p-1 text-neutral-500 hover:text-white transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Написать комментарий..."
              className="w-full bg-[#2a2d2e] text-white rounded-full pl-4 pr-12 py-2 text-sm outline-none border border-neutral-700 focus:border-neutral-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
