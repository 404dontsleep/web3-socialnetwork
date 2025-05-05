import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";

import themeStore from "@/stores/theme.store";

type MarkdownPreviewProps = MDEditorProps["previewOptions"];

const Editor = (props: MDEditorProps) => {
  const { theme } = themeStore();

  return (
    <div data-color-mode={theme}>
      <MDEditor
        preview="edit"
        previewOptions={{
          style: {
            backgroundColor: "transparent",
            ...props.previewOptions?.style,
          },
          ...props.previewOptions,
        }}
        style={{ backgroundColor: "transparent", ...props.style }}
        textareaProps={{
          style: {
            backgroundColor: "transparent",
            ...props.textareaProps?.style,
          },
          ...props.textareaProps,
        }}
        {...props}
      />
    </div>
  );
};

const Markdown = (props: MarkdownPreviewProps & { source?: string }) => {
  const { theme } = themeStore();

  return (
    <div data-color-mode={theme}>
      <MDEditor.Markdown
        {...props}
        style={{ backgroundColor: "transparent", ...props?.style }}
      />
    </div>
  );
};

export { Editor, Markdown };
