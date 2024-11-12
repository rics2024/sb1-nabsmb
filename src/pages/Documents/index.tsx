import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { AddDocumentDialog } from '@/components/documents/AddDocumentDialog';
import { DocumentViewDialog } from '@/components/documents/DocumentViewDialog';
import { useDocumentsStore } from '@/store/documents';

export function Documents() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const documents = useDocumentsStore((state) => state.documents);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Documents</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDocuments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No documents found
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                onView={() => handleViewDocument(doc)}
                onDownload={() => window.open(doc.url, '_blank')}
              />
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddDocumentDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
      <DocumentViewDialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        document={selectedDocument}
      />
    </div>
  );
}