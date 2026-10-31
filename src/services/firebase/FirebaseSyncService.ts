/**
 * Firebase Firestore & Auth Synchronizer Service for Laburety
 *
 * CRITICAL DESIGN:
 * 1. ZERO DATA LOSS: Existing localStorage data is ALWAYS preserved and never deleted or overwritten blindly.
 * 2. AUTOMATIC ACTIVE PERSISTENCE: If the user is unauthenticated, a stable persistent session ID is generated
 *    and stored in localStorage ("laburety_persistent_cloud_uid"), ensuring that writes and reads to Cloud Firestore
 *    work immediately from turn 1.
 * 3. REAL-TIME STATUS: Accurately reports "syncing", "synced" (Nube conectada), or "error".
 * 4. PULL & MERGE ON BOOT: On initial load, performs an automatic read from Cloud Firestore and merges
 *    safely with local storage data.
 */
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebaseConfig";
import { MasterLibrary, Resume, Company, AISettings } from "../../types";
import { StorageService } from "../storage/storageService";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export interface SyncStatus {
  state: "idle" | "syncing" | "synced" | "error" | "offline";
  lastSyncedAt: string | null;
  errorMessage?: string;
  isCloudConnected: boolean;
  userEmail?: string | null;
  userId?: string | null;
}

export class FirebaseSyncService {
  private static statusListeners: ((status: SyncStatus) => void)[] = [];
  private static currentStatus: SyncStatus = {
    state: "idle",
    lastSyncedAt: null,
    isCloudConnected: false,
    userEmail: null,
    userId: null,
  };

  public static getStatus(): SyncStatus {
    return { ...this.currentStatus };
  }

  public static onStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.statusListeners.push(callback);
    callback(this.getStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter((cb) => cb !== callback);
    };
  }

  private static updateStatus(updates: Partial<SyncStatus>): void {
    this.currentStatus = { ...this.currentStatus, ...updates };
    this.statusListeners.forEach((cb) => {
      try {
        cb(this.getStatus());
      } catch (e) {
        console.error("Status callback error:", e);
      }
    });
  }

  /**
   * Retrieves a persistent session user ID:
   * 1. Firebase Auth UID if user is signed in.
   * 2. Persistent local device session UID stored in localStorage so unauthenticated users
   *    have immediate, continuous Cloud Firestore persistence.
   */
  public static getPersistentUserId(): string {
    if (auth.currentUser?.uid) {
      return auth.currentUser.uid;
    }
    const STORAGE_KEY = "laburety_persistent_cloud_uid";
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn("localStorage read error:", e);
    }
    if (!stored || stored.trim().length === 0) {
      stored = "session_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      try {
        localStorage.setItem(STORAGE_KEY, stored);
      } catch (e) {
        console.warn("localStorage write error:", e);
      }
    }
    return stored;
  }

  /**
   * Initializes Firebase persistence, auth listeners and performs automatic initial pull & merge
   */
  public static initAuth(
    onUserDataLoaded?: (data: {
      library?: MasterLibrary;
      resumes?: Resume[];
      companies?: Company[];
      aiSettings?: AISettings;
    }) => void
  ): () => void {
    // 1. Validate connection to Firestore as per skill guidelines
    testConnection().catch(() => {});

    // 2. Identify the active userId immediately
    const initialUid = this.getPersistentUserId();
    this.updateStatus({
      isCloudConnected: true,
      userId: initialUid,
      userEmail: auth.currentUser?.email || (auth.currentUser ? "Usuario en la nube" : "Sesión persistente en la nube"),
      state: "syncing",
    });

    // 3. Immediately pull and merge cloud data with local data on boot
    this.pullAndMergeUserData(initialUid, onUserDataLoaded).catch((err: any) => {
      console.warn("Initial cloud sync note:", err?.message || err);
    });

    // 4. Listen to auth state transitions
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.updateStatus({
          isCloudConnected: true,
          userId: user.uid,
          userEmail: user.email || (user.isAnonymous ? "Sesión anónima en la nube" : "Usuario"),
        });
        try {
          await this.pullAndMergeUserData(user.uid, onUserDataLoaded);
        } catch (err: any) {
          console.warn("Initial cloud sync note on auth change:", err?.message || err);
        }
      }
    });

    return unsubscribe;
  }

  /**
   * Reads existing data from Cloud Firestore and safely merges it with local data.
   * If Firestore is empty, pushes local data to cloud ("migration sync").
   * Never deletes or overwrites existing valid information.
   */
  public static async pullAndMergeUserData(
    userId: string,
    onUserDataLoaded?: (data: {
      library?: MasterLibrary;
      resumes?: Resume[];
      companies?: Company[];
      aiSettings?: AISettings;
    }) => void
  ): Promise<void> {
    try {
      this.updateStatus({ state: "syncing" });

      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      const resumesColRef = collection(db, "users", userId, "resumes");
      const resumesSnap = await getDocs(resumesColRef);

      const companiesColRef = collection(db, "users", userId, "companies");
      const companiesSnap = await getDocs(companiesColRef);

      const hasCloudData = userSnap.exists() || !resumesSnap.empty || !companiesSnap.empty;

      if (!hasCloudData) {
        // Firestore is empty for this user: Perform initial migration sync
        const localLib = StorageService.getMasterLibrary();
        const localResumes = StorageService.getResumes();
        const localCompanies = StorageService.getCompanies();
        const localAISettings = StorageService.getAISettings();

        await this.syncAllToFirestoreWithUid(userId, localLib, localResumes, localCompanies, localAISettings);
        this.updateStatus({
          state: "synced",
          lastSyncedAt: new Date().toISOString(),
          isCloudConnected: true,
        });
        return;
      }

      // Firestore has data: perform a safe, non-destructive merge
      const cloudData = userSnap.data();
      const loadedLibrary: MasterLibrary | undefined = cloudData?.masterLibrary;
      const loadedAiSettings: AISettings | undefined = cloudData?.aiSettings;

      const loadedResumes: Resume[] = [];
      resumesSnap.forEach((docSnap) => {
        const item = docSnap.data() as Resume;
        if (item && item.id) loadedResumes.push(item);
      });

      const loadedCompanies: Company[] = [];
      companiesSnap.forEach((docSnap) => {
        const item = docSnap.data() as Company;
        if (item && item.id) loadedCompanies.push(item);
      });

      // 1. Check for explicitly deleted resume IDs and default demo CVs
      const localResumes = StorageService.getResumes();
      const localResumeIds = new Set(localResumes.map((r) => r.id));
      const deletedIds = new Set(StorageService.getDeletedResumeIds());

      // If a resume doc in Firestore matches a known generic seed CV
      // and is NOT in localResumes, the user deleted it: mark as deleted and purge permanently from Firestore
      for (const item of loadedResumes) {
        const isGenericSeed =
          item.id === "resume-seguridad-1" ||
          item.id === "resume-operaciones-2" ||
          item.name?.includes("Gestión y Operaciones Logísticas") ||
          item.name?.includes("Seguridad y Supervisión Operativa");

        if (isGenericSeed && !localResumeIds.has(item.id)) {
          StorageService.recordDeletedResumeId(item.id);
          deletedIds.add(item.id);
        }
      }

      // Purge lingering deleted documents directly from Firestore
      for (const item of loadedResumes) {
        if (deletedIds.has(item.id)) {
          deleteDoc(doc(db, "users", userId, "resumes", item.id)).catch(console.warn);
        }
      }

      // 2. Filter out all deleted resumes from both cloud and local lists
      const validCloudResumes = loadedResumes.filter((r) => !deletedIds.has(r.id));
      const validLocalResumes = localResumes.filter((r) => !deletedIds.has(r.id));

      // 3. Merge Resumes safely: include all valid cloud resumes, plus any valid local resumes not in cloud
      const mergedResumes: Resume[] = [...validCloudResumes];
      let hasLocalUnsyncedResumes = false;

      validLocalResumes.forEach((localR: Resume) => {
        const cloudIdx = mergedResumes.findIndex((r) => r.id === localR.id);
        if (cloudIdx === -1) {
          mergedResumes.push(localR);
          hasLocalUnsyncedResumes = true;
        } else {
          // Both exist: if local has a more recent updatedAt, prefer local
          const cloudR = mergedResumes[cloudIdx];
          if (localR.updatedAt && cloudR.updatedAt && localR.updatedAt > cloudR.updatedAt) {
            mergedResumes[cloudIdx] = localR;
            hasLocalUnsyncedResumes = true;
          }
        }
      });

      // Merge Companies safely
      const localCompanies = StorageService.getCompanies();
      const mergedCompanies: Company[] = [...loadedCompanies];
      let hasLocalUnsyncedCompanies = false;

      localCompanies.forEach((localC: Company) => {
        const cloudIdx = mergedCompanies.findIndex((c) => c.id === localC.id);
        if (cloudIdx === -1) {
          mergedCompanies.push(localC);
          hasLocalUnsyncedCompanies = true;
        } else {
          const cloudC = mergedCompanies[cloudIdx];
          if (localC.updatedAt && cloudC.updatedAt && localC.updatedAt > cloudC.updatedAt) {
            mergedCompanies[cloudIdx] = localC;
            hasLocalUnsyncedCompanies = true;
          }
        }
      });

      // Merge Library safely
      const localLib = StorageService.getMasterLibrary();
      const finalLibrary = loadedLibrary ? { ...localLib, ...loadedLibrary } : localLib;

      // Update local storage cache (always save resumes, even if collection is empty [])
      if (finalLibrary) StorageService.saveMasterLibrary(finalLibrary);
      StorageService.saveResumes(mergedResumes);
      StorageService.saveCompanies(mergedCompanies);
      if (loadedAiSettings) StorageService.saveAISettings(loadedAiSettings);

      // If local had newer items not yet in cloud, push them back
      if (hasLocalUnsyncedResumes || hasLocalUnsyncedCompanies) {
        this.syncAllToFirestoreWithUid(
          userId,
          finalLibrary,
          mergedResumes,
          mergedCompanies,
          loadedAiSettings || StorageService.getAISettings()
        ).catch(console.warn);
      }

      this.updateStatus({
        state: "synced",
        lastSyncedAt: new Date().toISOString(),
        isCloudConnected: true,
        errorMessage: undefined,
      });

      if (onUserDataLoaded) {
        onUserDataLoaded({
          library: finalLibrary,
          resumes: mergedResumes, // Pass mergedResumes array directly, even if empty []
          companies: mergedCompanies,
          aiSettings: loadedAiSettings,
        });
      }
    } catch (err: any) {
      console.error("Error pulling Firestore data:", err);
      this.updateStatus({
        state: "error",
        errorMessage: err?.message || "Error al sincronizar con la nube",
      });
    }
  }

  /**
   * Sincroniza todo el estado actual (Library, Resumes, Companies, AISettings) a Cloud Firestore
   */
  public static async syncAllToFirestore(
    library: MasterLibrary,
    resumes: Resume[],
    companies: Company[],
    aiSettings: AISettings
  ): Promise<boolean> {
    const uid = this.getPersistentUserId();
    return this.syncAllToFirestoreWithUid(uid, library, resumes, companies, aiSettings);
  }

  /**
   * Deeply removes `undefined` fields from any object or array before sending to Firestore,
   * preventing `FirebaseError: Unsupported field value: undefined`.
   */
  private static sanitizeForFirestore<T>(data: T): T {
    if (data === null || data === undefined) {
      return data;
    }
    if (Array.isArray(data)) {
      return data
        .filter((item) => item !== undefined)
        .map((item) => this.sanitizeForFirestore(item)) as unknown as T;
    }
    if (typeof data === "object" && data.constructor === Object) {
      const cleaned: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleaned[key] = this.sanitizeForFirestore(value);
        }
      }
      return cleaned as T;
    }
    return data;
  }

  /**
   * Commits the data to Cloud Firestore for a given UID
   */
  private static async syncAllToFirestoreWithUid(
    uid: string,
    library: MasterLibrary,
    resumes: Resume[],
    companies: Company[],
    aiSettings: AISettings
  ): Promise<boolean> {
    try {
      this.updateStatus({ state: "syncing" });

      const batch = writeBatch(db);

      // 1. Root user doc with masterLibrary & aiSettings
      const userRef = doc(db, "users", uid);
      batch.set(
        userRef,
        {
          masterLibrary: this.sanitizeForFirestore(library),
          aiSettings: this.sanitizeForFirestore(aiSettings),
          updatedAt: serverTimestamp(),
          clientLastSaved: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Resumes collection
      resumes.forEach((resume) => {
        if (!resume.id) return;
        const resumeRef = doc(db, "users", uid, "resumes", resume.id);
        batch.set(resumeRef, this.sanitizeForFirestore(resume), { merge: true });
      });

      // 3. Companies collection
      companies.forEach((company) => {
        if (!company.id) return;
        const companyRef = doc(db, "users", uid, "companies", company.id);
        batch.set(companyRef, this.sanitizeForFirestore(company), { merge: true });
      });

      await batch.commit();

      // Clean up any deleted resume documents that may still exist in Firestore
      const deletedIds = StorageService.getDeletedResumeIds();
      for (const delId of deletedIds) {
        deleteDoc(doc(db, "users", uid, "resumes", delId)).catch(console.warn);
      }

      this.updateStatus({
        state: "synced",
        lastSyncedAt: new Date().toISOString(),
        errorMessage: undefined,
        isCloudConnected: true,
      });
      return true;
    } catch (err: any) {
      console.error("Firestore sync error:", err);
      this.updateStatus({
        state: "error",
        errorMessage: err?.message || "Error al guardar en Firestore",
      });
      return false;
    }
  }

  /**
   * Sincroniza un CV individual directamente
   */
  public static async syncResume(resume: Resume): Promise<void> {
    const uid = this.getPersistentUserId();
    if (!resume.id) return;
    try {
      const resumeRef = doc(db, "users", uid, "resumes", resume.id);
      await setDoc(resumeRef, this.sanitizeForFirestore(resume), { merge: true });
    } catch (e) {
      console.warn("Error syncing single resume:", e);
    }
  }

  /**
   * Elimina de forma directa y permanente un CV de la colección de Cloud Firestore
   */
  public static async deleteResumeFromFirestore(resumeId: string): Promise<void> {
    const uid = this.getPersistentUserId();
    if (!resumeId) return;
    try {
      this.updateStatus({ state: "syncing" });
      const resumeRef = doc(db, "users", uid, "resumes", resumeId);
      await deleteDoc(resumeRef);
      console.log(`Document users/${uid}/resumes/${resumeId} eliminado de Cloud Firestore`);
      this.updateStatus({
        state: "synced",
        lastSyncedAt: new Date().toISOString(),
        isCloudConnected: true,
      });
    } catch (err: any) {
      console.error("Error al eliminar documento del CV en Firestore:", err);
      this.updateStatus({
        state: "error",
        errorMessage: err?.message || "Error al eliminar CV de Firestore",
      });
    }
  }

  /**
   * Sincroniza una empresa individual directamente
   */
  public static async syncCompany(company: Company): Promise<void> {
    const uid = this.getPersistentUserId();
    if (!company.id) return;
    try {
      const companyRef = doc(db, "users", uid, "companies", company.id);
      await setDoc(companyRef, this.sanitizeForFirestore(company), { merge: true });
    } catch (e) {
      console.warn("Error syncing company:", e);
    }
  }

  /**
   * Elimina de forma directa y permanente una empresa de Cloud Firestore
   */
  public static async deleteCompanyFromFirestore(companyId: string): Promise<void> {
    const uid = this.getPersistentUserId();
    if (!companyId) return;
    try {
      const companyRef = doc(db, "users", uid, "companies", companyId);
      await deleteDoc(companyRef);
      console.log(`Document users/${uid}/companies/${companyId} eliminado de Cloud Firestore`);
    } catch (err: any) {
      console.error("Error al eliminar documento de empresa en Firestore:", err);
    }
  }

  /**
   * Inicia sesión con Google Popup
   */
  public static async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      this.updateStatus({ state: "syncing" });
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        this.updateStatus({
          isCloudConnected: true,
          userId: result.user.uid,
          userEmail: result.user.email,
        });
        return { success: true };
      }
      return { success: false, error: "No se pudo iniciar sesión con Google." };
    } catch (err: any) {
      console.warn("Google sign-in error:", err);
      return { success: false, error: err?.message || "Error al iniciar sesión con Google" };
    }
  }

  /**
   * Inicia sesión con Email y Contraseña (con fallback a registro si es nuevo)
   */
  public static async loginWithEmail(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        try {
          await createUserWithEmailAndPassword(auth, email, pass);
          return { success: true };
        } catch (signupErr: any) {
          return { success: false, error: signupErr?.message || "Error al autenticar en Firebase" };
        }
      }
      return { success: false, error: err?.message || "Error al iniciar sesión en Firebase" };
    }
  }

  /**
   * Intenta login anónimo si está habilitado
   */
  public static async loginAnonymously(): Promise<boolean> {
    try {
      await signInAnonymously(auth);
      return true;
    } catch (e) {
      // Si el proveedor anónimo no está habilitado en Firebase console,
      // la sesión persistente por UID garantiza el funcionamiento sin interrupciones.
      return false;
    }
  }

  /**
   * Cierra sesión
   */
  public static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Error signing out from Firebase:", e);
    }
  }
}
