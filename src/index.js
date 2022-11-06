import JSONWorker from 'url:monaco-editor/esm/vs/language/json/json.worker.js';
import CSSWorker from 'url:monaco-editor/esm/vs/language/css/css.worker.js';
import HTMLWorker from 'url:monaco-editor/esm/vs/language/html/html.worker.js';
import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return JSONWorker;
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return CSSWorker;
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return HTMLWorker;
		}
		if (label === 'typescript' || label === 'javascript') {
			return TSWorker;
		}
		return EditorWorker;
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('container');
	let saveDebounce;

  monaco.editor.setTheme('vs-dark');

  function modelChangeHandlerFactory(editor) {
    return function() {
      if (saveDebounce) {
        clearTimeout(saveDebounce);
      }
  
      saveDebounce = setTimeout(() => {
        const content = editor.getValue();
        localStorage.setItem('__content', content);
        saveDebounce = clearTimeout(saveDebounce);
      }, 500);
    }
  }

  function resizeWindowHandlerFactory(editor) {
    return function() {
      editor.layout();
    }
  }

  function renderEditor(monaco) {
    const content = localStorage.getItem('__content') || '';
    const options = {
      value: content,
      language: 'markdown',
      fontSize: 16,
      folding: true,
      showFoldingControls: 'always',
      // wordBasedSuggestions are verbose when writing markdown
      // Docs: https://github.com/microsoft/monaco-editor/blob/0f8ea460807f622d791c72dfb3ae1f22a54c209b/website/typedoc/monaco.d.ts#L1233-L1237
      wordBasedSuggestions: false
    };
    const editor = monaco.editor.create(container, options);
    editor.setTheme('vs-dark');
    return editor;
  }

  const editor = renderEditor(monaco);

  editor.onDidChangeModelContent(modelChangeHandlerFactory(editor));
  window.addEventListener('resize', resizeWindowHandlerFactory(editor));

  window.editor = editor;
});