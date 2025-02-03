import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300',
        className
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
          </p>
        </div>
      )}
    </div>
  );
}