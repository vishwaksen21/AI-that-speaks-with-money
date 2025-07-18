
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileJson, CheckCircle } from 'lucide-react';

export default function ImportDataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFile(null);
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

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted">
                <FileJson className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            )}
            
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-pulse" />
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
                <div className="flex items-center gap-3 p-4 rounded-md border text-green-700 bg-green-50 border-green-200">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium text-sm">File uploaded successfully! Your data is now being processed.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
