import { create } from 'zustand';

export type DocumentType = 'physical' | 'digital';
export type DocumentCategory = 'academic' | 'history' | 'skills' | 'arts' | 'general';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileType?: string; // For digital documents (PDF, DOC, etc.)
  category: DocumentCategory;
  description?: string;
  quantity?: number; // For physical documents
  availableQuantity?: number; // For physical documents
  url?: string; // For digital documents
  borrowers: string[]; // Array of user IDs who borrowed the document
  status: 'available' | 'borrowed' | 'out_of_stock';
  date: string;
}

interface DocumentsState {
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'status' | 'borrowers' | 'date' | 'availableQuantity'>) => void;
  removeDocument: (id: string) => void;
  borrowDocument: (documentId: string, userId: string) => void;
  returnDocument: (documentId: string, userId: string) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [
    {
      id: '1',
      name: 'Mathematics Textbook Grade 5',
      type: 'physical',
      category: 'academic',
      quantity: 5,
      availableQuantity: 3,
      borrowers: ['user1', 'user2'],
      status: 'available',
      date: '2024-03-15',
    },
    {
      id: '2',
      name: 'School Curriculum 2024',
      type: 'digital',
      fileType: 'PDF',
      category: 'academic',
      url: 'https://example.com/curriculum.pdf',
      borrowers: [],
      status: 'available',
      date: '2024-03-15',
    },
  ],
  
  addDocument: (documentData) => 
    set((state) => ({
      documents: [
        ...state.documents,
        {
          ...documentData,
          id: Math.random().toString(36).substr(2, 9),
          status: 'available',
          borrowers: [],
          date: new Date().toISOString(),
          availableQuantity: documentData.type === 'physical' ? documentData.quantity : undefined,
        },
      ],
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  borrowDocument: (documentId, userId) =>
    set((state) => ({
      documents: state.documents.map((doc) => {
        if (doc.id === documentId) {
          const newAvailableQuantity = doc.type === 'physical' 
            ? (doc.availableQuantity || 0) - 1 
            : undefined;
          
          return {
            ...doc,
            borrowers: [...doc.borrowers, userId],
            availableQuantity: newAvailableQuantity,
            status: doc.type === 'physical' 
              ? (newAvailableQuantity === 0 ? 'out_of_stock' : 'borrowed')
              : 'borrowed',
          };
        }
        return doc;
      }),
    })),

  returnDocument: (documentId, userId) =>
    set((state) => ({
      documents: state.documents.map((doc) => {
        if (doc.id === documentId) {
          const newAvailableQuantity = doc.type === 'physical'
            ? (doc.availableQuantity || 0) + 1
            : undefined;
          
          const newBorrowers = doc.borrowers.filter(id => id !== userId);
          
          return {
            ...doc,
            borrowers: newBorrowers,
            availableQuantity: newAvailableQuantity,
            status: newBorrowers.length === 0 ? 'available' : 'borrowed',
          };
        }
        return doc;
      }),
    })),
}));