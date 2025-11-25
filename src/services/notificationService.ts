import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AppNotification } from '../types/Notification';

/**
 * Create a notification in Firestore
 */
export async function createNotification(
  userId: string,
  type: AppNotification['type'],
  title: string,
  body: string,
  data?: {
    campaignId?: string;
    donationId?: string;
    action?: string;
  }
): Promise<string> {
  if (!db) throw new Error('Firebase is not initialized');

  const notification: Omit<AppNotification, 'id'> = {
    userId,
    type,
    title,
    body,
    data: data || {},
    read: false,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, 'notifications'), notification);
  console.log('Notification created:', docRef.id);
  return docRef.id;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  if (!db) throw new Error('Firebase is not initialized');

  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  if (!db) throw new Error('Firebase is not initialized');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  const updatePromises = snapshot.docs.map((doc) =>
    updateDoc(doc.ref, { read: true })
  );

  await Promise.all(updatePromises);
  console.log(`Marked ${snapshot.size} notifications as read`);
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  if (!db) throw new Error('Firebase is not initialized');

  await deleteDoc(doc(db, 'notifications', notificationId));
  console.log('Notification deleted:', notificationId);
}

/**
 * Get user's notifications (with pagination)
 */
export async function getUserNotifications(
  userId: string,
  limitCount: number = 50
): Promise<AppNotification[]> {
  if (!db) throw new Error('Firebase is not initialized');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AppNotification[];
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (!db) throw new Error('Firebase is not initialized');

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}
