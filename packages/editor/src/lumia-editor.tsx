export interface LumiaEditorProps {
  className?: string;
  placeholder?: string;
}

export const LumiaEditor = ({
  className,
  placeholder = 'Type something...',
}: LumiaEditorProps) => {
  return (
    <div className={className}>
      <textarea
        placeholder={placeholder}
        style={{ width: '100%', minHeight: '150px', padding: '8px' }}
      />
    </div>
  );
};
