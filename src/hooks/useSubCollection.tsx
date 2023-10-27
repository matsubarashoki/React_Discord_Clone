import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  onSnapshot,
  collection,
  query,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { useAppSelecter } from "../app/hooks";

interface Messages {
  timestamp: Timestamp;
  message: string;
  user: null | {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
}

const useSubCollection = (
  collectionName: string,
  subCollectionName: string
) => {
  const channelId = useAppSelecter((state) => state.channel.channelId);
  const [subDocuments, setSubDocuments] = useState<Messages[]>([]);
  let collectionRef = collection(
    db,
    collectionName,
    String(channelId),
    subCollectionName
  );

  const collectionRefOrderBy = query(
    collectionRef,
    orderBy("timestamp", "asc")
  );
  useEffect(() => {
    onSnapshot(collectionRefOrderBy, (snapshot) => {
      let results: Messages[] = [];
      snapshot.docs.forEach((doc) =>
        results.push({
          timestamp: doc.data().timestamp,
          message: doc.data().message,
          user: doc.data().user,
        })
      );
      setSubDocuments(results);
    });
  }, [channelId]);
  return { subDocuments };
};

export default useSubCollection;
