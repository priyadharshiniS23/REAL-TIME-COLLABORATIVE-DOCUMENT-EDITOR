import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean']
];

function App() {
  const editorRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    const editor = document.createElement('div');
    wrapperRef.current.innerHTML = '';
    wrapperRef.current.append(editor);

    const quill = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS }
    });
    editorRef.current = quill;

    const docId = 'demo-doc';
    socket.emit('joinDoc', docId);

    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('docUpdate', { docId, content: quill.getContents() });
    });

    socket.on('docUpdate', content => {
      quill.setContents(content);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}

export default App;