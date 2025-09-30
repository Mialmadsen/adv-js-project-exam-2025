import { onMounted, ref } from 'vue'
import { collection, onSnapshot , doc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from './firebase.js'

export function usePosts() {
    const postsFBcollectionRef = 'posts';

    const posts = ref([]);
    const newPostsTitle = ref('');
    
    const showErrorMessage = ref(false);
    
    
    onMounted(() => {
      // realtime listener for posts collection
      onSnapshot(collection(db, postsFBcollectionRef), (snapshot) => {
        posts.value = snapshot.docs.map(doc => ({id: doc.id,...doc.data()}));
      });
    });
    
    const addPost = async () => {
      if (newPostsTitle.value.trim() === '') // === comparison, same data type
        {
          showErrorMessage.value = true;
      return; 
        }
    
      await addDoc(collection(db, postsFBcollectionRef), { 
         title: newPostsTitle.value 
        });
    
      newPostsTitle.value = '';
      showErrorMessage.value = false;
    }
    
    const deletePost = async (id) => {
     try {
      console.log("Delete post with ID: ", id);
      const postDoc = doc(db, postsFBcollectionRef, id);
      await deleteDoc(postDoc);
     }
     catch (error) {
      console.error("Error deleting document: ", error);
     }
    }


    return { posts, newPostsTitle, addPost, deletePost, showErrorMessage }
}