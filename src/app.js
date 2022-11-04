import {EditorState} from "@codemirror/state"
import {EditorView, keymap, highlightActiveLine} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import { oneDark } from '@codemirror/theme-one-dark';

document.addEventListener('DOMContentLoaded', () => {
  const editorElement = document.body.querySelector('#editor');
  let saveDebounce;
  const existingContent = localStorage.getItem('__content');
  
  function updateHandler(event) {
    if (!event.docChanged) {
      return
    }
  
    if (saveDebounce) {
      clearTimeout(saveDebounce);
    }
  
    saveDebounce = setTimeout(() => {
      const { doc } = event.state.toJSON();
      localStorage.setItem('__content', doc);
  
      window.__event = event;
      saveDebounce = clearTimeout(saveDebounce);
    }, 500);
  }
  
  let startState = EditorState.create({
    doc: existingContent || '',
    extensions: [
      keymap.of(defaultKeymap),
      highlightActiveLine(),
      EditorView.updateListener.of(updateHandler),
      oneDark,
    ]
  })
  
  let view = new EditorView({
    state: startState,
    parent: editorElement
  });

  view.highlightActiveLine();
});