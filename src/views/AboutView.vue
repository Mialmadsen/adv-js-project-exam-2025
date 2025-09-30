<template>
  <div class="about">
    <h1>This is an about post page</h1>

    <input type="text" v-model="newPostsTitle" placeholder="Post Title" />
    <button @click="addPost">Add Post</button>
    <span v-if="showErrorMessage"> Have to enter a post title</span>

    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
        {{ post.id }}
        <button @click="deletePost(post.id)">delete</button>
      </li>
    </ul>

  </div>
</template>



<script setup>
import { usePosts } from '../modules/usePosts.js'

const { posts, newPostsTitle, showErrorMessage, addPost, deletePost } = usePosts()

</script>


<style>

@media (min-width: 1024px) {
/*   .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  } */
}
</style>
