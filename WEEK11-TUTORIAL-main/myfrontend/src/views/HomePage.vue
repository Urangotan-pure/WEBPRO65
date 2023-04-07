<template>
    <!-- เอาโค้ดมาจากสัปดาห์ที่ 10 และ แก้จาก ejs > VUE -->
    <div class="container is-widescreen">
        <section class="hero">
            <div class="hero-body">
                <p class="title">My Stories</p>
            </div>
        </section>
        <section class="section" id="app">
            <div class="content">
                <div class="columns">
                    <div class="column is-4 is-offset-2">
                        <input class="input" type="text" name="search" placeholder="ค้นชื่อบทความ" />
                    </div>
                    <div class="column is-2">
                        <input class="button" type="submit" value="Search" />
                    </div>
                    <div class="column is-2">
                        <!-- เพิ่ม ------------------------------------ -->
                        <router-link to="/blog/create">
                        <input class="button" type="button" value="Create New Blog" />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="columns is-multiline">
                    <!-- loop -->
                    <div class="column is-3" v-for="blog in blogs" :key="blog.id">
                        <div class="card">
                            <div class="card-image pt-5">
                                <figure class="image">
                                    <!-- image -->
                                    <img :src="
                                        blog.file_path
                                            ? blog.file_path
                                            : 'https://bulma.io/images/placeholders/640x360.png'
                                    " alt="Placeholder image" />
                                </figure>
                            </div>
                            <div class="card-content">
                                <div class="title">{{ blog.title }}</div>
                                <div class="content">
                                    <span v-if="blog.content.length > 200">
                                        {{ blog.content.substring(0, 197) + "..." }}
                                    </span>
                                    <span v-else>
                                        {{ blog.content }}
                                    </span>
                                </div>
                            </div>
                            <footer class="card-footer">
                                <router-link class="card-footer-item" :to="'/detail/' + blog.id">
                                 Read more... 
                                </router-link>
                                <a class="card-footer-item" @click="like(blog.id)">
                                    <span class="icon-text">
                                        <span class="icon">
                                            <i class="far fa-heart"></i>
                                        </span>
                                        <span >Like {{ blog.like }} </span>
                                    </span>
                                </a>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script>
import axios from "axios";
export default {
    data() {
        return {
            blogs: null, // add blogs variable
        };
    },
    created() {
        axios
            .get("http://localhost:3000/")
            .then((response) => {
                this.blogs = response.data;
                console.log(this.blogs);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        like(id) {
            // ยิง post ไปที่path ข้างล่าง
            axios.post('http://localhost:3000/blogs/addlike/' + id
            ).then(response => {
                console.log(response.data)
                // this.$router.go({ path: '/' }) // Success! -> redirect to home page
                //ไม่ต้อง re แต่เป็นการทับข้อมุลทั้งหน้าใหม่
                // axios
                // .get("http://localhost:3000/")
                // .then((response2) => {
                //     this.blogs = response2.data;
                //     console.log(this.blogs);
                // })
                // .catch((err) => {
                //     console.log(err);
                // });
                // })
                // ดู res ว่า ค่า id ที่ส่งเข้ามา ตรงกับ ที่blogs มีไหม ถ้ามีก็ให้ทำการทับค่าลงไป
                const index = this.blogs.findIndex(blog => blog.id == response.data.blogId)
                console.log(index)
                this.blogs[index].like = response.data.likeNum;
                })
                //-------------------------------------
            .catch(error => {
                    console.log(error.message);
            });
        },
        // detail(id) {
        //     // ยิง post ไปที่path ข้างล่าง
        //     axios.get('http://localhost:3000/blogs/' + id)
        //     .then(response => {
        //         console.log(response.data)
        //         this.$router.push({ path: '/' }) // Success! -> redirect to home page
                
        //     })
        //         .catch(error => {
        //             console.log(error.message);
        //         });
        // },
    }
};
</script>
  
<style scoped></style>