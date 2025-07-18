
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileJson, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ImportDataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/json') {
        setSelectedFile(file);
        setUploadSuccess(false);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid JSON file.',
          variant: 'destructive',
        });
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      toast({
        title: 'Upload Successful!',
        description: 'Your financial data has been processed.',
      });
      // Optionally redirect after success
      setTimeout(() => router.push('/dashboard'), 1000);
    }, 1500);
  };

  return (
    <AppLayout pageTitle="Import Data">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Import Your Financial Data</CardTitle>
            <CardDescription>Upload a JSON file with your consolidated financial information to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="file-upload" className="font-medium">
                JSON File
              </label>
              <div className="flex items-center gap-4">
                <Input id="file-upload" type="file" accept=".json" onChange={handleFileChange} className="flex-1" />
              </div>
            </div>

            {selectedFile && !uploadSuccess && (
              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted">
                <FileJson className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            )}
            
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading || uploadSuccess} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Process File
                </>
              )}
            </Button>
            
            {uploadSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-md border text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium text-sm">File uploaded successfully! Redirecting to dashboard...</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
