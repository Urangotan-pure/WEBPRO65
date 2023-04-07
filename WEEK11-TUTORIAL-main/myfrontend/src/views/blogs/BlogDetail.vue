<template>
    <!-- <div> 555 </div> -->
    <!-- เอาโค้ดมาจากสัปดาห์ที่ 10 และ แก้จาก ejs > VUE -->
    <div class="container is-widescreen">
        <section class="section" v-if="blogs.error">
            <div class="container is-widescreen">
                <div class="notification is-danger">
                    {{ blogs.error.code + ': ' + blogs.error.sqlMessage }}
                </div>
            </div>
        </section>
        <section class="hero" v-else>
            <div class="hero-body">
                <p class="title">{{ blogs.blog.title }}</p>
            </div>
        </section>
        <section class="section" id="app">
            <div class="content">
                <div class="card has-background-light">
                    <div class="card-image pt-5">
                        <div class="columns">
                            <div class="column" v-for="image in blogs.images" :key="image.id">
                                <figure class="image">
                                    <img :src="image.file_path ? 'http://localhost:3000' + image.file_path : 'https://bulma.io/images/placeholders/640x360.png'"
                                        alt="Placeholder image">
                                </figure>
                            </div>
                        </div>

                    </div>
                    <div class="card-content">
                        <div class="content">
                            {{ blogs.blog.content }}
                        </div>
                        <div class="container">
                            <p class="subtitle">Comments</p>
                            <div class="box" v-for="comment in blogs.comments" :key="comment.id">
                                <article class="media">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="comment.file_path ? 'http://localhost:3000'+ comment.file_path : 'https://bulma.io/images/placeholders/640x360.png'"
                                                alt="Placeholder image">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                {{ comment.comment }}
                                            </p>
                                            <p class="is-size-7">{{ comment.comment_date }}</p>
                                        </div>
                                        <nav class="level is-mobile">
                                            <div class="level-left">
                                                <a class="level-item" aria-label="like">
                                                    <span class="icon is-small">
                                                        <i class="fas fa-heart" aria-hidden="true"></i>
                                                    </span>
                                                </a>
                                            </div>
                                        </nav>
                                    </div>
                                </article>
                            </div>
                            <form>
                                <div class="columns box">
                                    <div class="column is-7">
                                        <input class="input" type="text" name="comment" placeholder="Comment here..."
                                            v-model="comment">
                                    </div>
                                    <div class="column is-3">
                                        <div class="file">
                                            <label class="file-label">
                                                <input class="file-input" type="file" name="comment_image" ref="file" @change="handleFileUpload() ">
                                                <span class="file-cta">
                                                    <span class="file-icon">
                                                        <i class="fas fa-upload"></i>
                                                    </span>
                                                    <span class="file-label">
                                                        Choose an image…
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="column is-2">
                                        <input class="button is-primary" type="submit" @click.prevent="submit(blogs.blog.id)">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item" href="/">To Home Page</a>
                    </footer>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
// เพิ่ม
import axios from 'axios';
export default {
    data() {
        return {
            blogs: null,
            file : null
        }
    },
    created() {
        axios
            .get("http://localhost:3000/blogs/" + this.$route.params.id) //รับค่าที่ถูกส่งมาจากการclick ที่หน้า HomePage.vue
            .then((response) => {
                this.blogs = response.data;
                console.log(this.blogs);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
            // ref : ref="file" 
        },
        submit(id) {
            console.log(id);
            console.log(this.file);
            var formData = new FormData();
            formData.append("comment_image", this.file);
            formData.append("comment", this.comment);
            // ยิง post ไปที่path ข้างล่าง
            axios.post('http://localhost:3000/'+ id +'/comments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data)

                const index = response.data.comments.length - 1;
                console.log(response.data.comments[index])
                this.blogs.comments.push(response.data.comments[index])

                
            })
                .catch(error => {
                    console.log(error.message);
                });
        }
    },
}
</script>