import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

/**
 * Simple object check.
 * @param docs
 * @returns {Object}
 */

export default function getData(docs: QueryDocumentSnapshot<DocumentData>[]) {
  return docs.reduce((accumulator, doc) => {
    accumulator[doc.id] = doc.data();
    return accumulator
  }, {} as Record<string, DocumentData>);
}
