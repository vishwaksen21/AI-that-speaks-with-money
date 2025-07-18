
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, Loader2, AlertTriangle, Wand2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFinancialData } from './actions';
import { LOCAL_STORAGE_KEY } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ImportDataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setUploadSuccess(false);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result;
        if (!fileContent) {
          throw new Error('Could not read file content.');
        }

        let result;
        // Check if the uploaded file is an image
        if (selectedFile.type.startsWith('image/')) {
            // The file content is already a data URI (string) from reader.readAsDataURL
            result = await uploadFinancialData({ 
                fileContent: fileContent as string, 
                type: selectedFile.type,
                isImage: true
            });
        } else {
            // For other files, content is ArrayBuffer from reader.readAsArrayBuffer
             result = await uploadFinancialData({
                fileContent: Array.from(new Uint8Array(fileContent as ArrayBuffer)),
                type: selectedFile.type,
                isImage: false
            });
        }

        if (result.success && result.data) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result.data));
            setUploadSuccess(true);
            toast({
                title: 'Analysis Complete!',
                description: 'Your financial data has been extracted and processed.',
            });
            setTimeout(() => router.push('/dashboard'), 1500); 
        } else {
            throw new Error(result.error || 'The AI could not process your file. Please check the content.');
        }

      } catch (err: any) {
        const friendlyError = err.message || 'An unexpected error occurred. Please try again.';
        setError(friendlyError);
        toast({
          title: 'Analysis Failed',
          description: friendlyError,
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
        setError('Failed to read file.');
        setIsUploading(false);
        toast({
            title: 'File Read Error',
            description: 'Could not read the selected file.',
            variant: 'destructive'
        });
    };

    // Use readAsDataURL for images to get the base64 string directly
    if (selectedFile.type.startsWith('image/')) {
        reader.readAsDataURL(selectedFile);
    } else { // Use readAsArrayBuffer for other file types
        reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <AppLayout pageTitle="Import Data">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Import Your Financial Data with AI</CardTitle>
            <CardDescription>Upload a file (txt, csv, json, xlsx, or an image) with your financial info. Our AI will analyze and structure it for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="file-upload" className="font-medium">
                Data File
              </label>
              <div className="flex items-center gap-4">
                <Input id="file-upload" type="file" onChange={handleFileChange} className="flex-1" disabled={isUploading} accept=".txt,.csv,.json,.xlsx,image/*" />
              </div>
            </div>

            {selectedFile && !uploadSuccess && (
              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
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
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Upload and Analyze
                </>
              )}
            </Button>
            
            {uploadSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-md border text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium text-sm">Analysis successful! Redirecting to dashboard...</p>
                </div>
            )}
            {error && (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>

        {error && (
            <Card>
                 <CardHeader>
                    <div className="flex items-center gap-2">
                         <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="font-headline text-xl">Having Trouble?</CardTitle>
                    </div>
                    <CardDescription>If the AI is unable to process your file, try these steps.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                   <div>
                        <h4 className="font-semibold text-foreground mb-1">1. Check the File Format</h4>
                        <p>Make sure your document is in a supported format like TXT, CSV, XLSX, PNG, or JPG. If not, try converting it first.</p>
                   </div>
                   <div>
                        <h4 className="font-semibold text-foreground mb-1">2. For Images or Scanned PDFs</h4>
                        <p>Ensure the text is clear and readable. High-quality scans or photos work best for OCR (Optical Character Recognition).</p>
                   </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">3. Split Large Files</h4>
                        <p>If your file is very large (e.g., many pages or high resolution), the AI might time out. Try splitting it into smaller chunks.</p>
                   </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">4. Check for Corruption</h4>
                        <p>Try opening the file on your device. If it doesn't open, it might be corrupted. Try re-saving or re-exporting it.</p>
                   </div>
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
