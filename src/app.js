import {EditorState} from "@codemirror/state"
import {EditorView, keymap, highlightActiveLine} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"

document.addEventListener('DOMContentLoaded', () => {
  const editorElement = document.body.querySelector('#editor');
  const existingContent = localStorage.getItem('__content');
  let saveDebounce;
  
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
  
  const startState = EditorState.create({
    doc: existingContent || '',
    extensions: [
      keymap.of(defaultKeymap),
      highlightActiveLine(),
      EditorView.updateListener.of(updateHandler)
    ]
  });
  
  const view = new EditorView({
    state: startState,
    parent: editorElement
  });
});