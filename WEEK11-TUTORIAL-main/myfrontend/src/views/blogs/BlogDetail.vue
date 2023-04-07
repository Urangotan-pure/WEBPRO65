<template>
    <!-- <div> 555 </div> -->
    <!-- เอาโค้ดมาจากสัปดาห์ที่ 10 และ แก้จาก ejs > VUE -->
    <div class="container is-widescreen" >
        <section class="section" v-if="blogs.error">
        <div class="container is-widescreen">
            <div class="notification is-danger">
              {{blogs.error.code + ': ' + blogs.error.sqlMessage}}
            </div>
          </div>
        </section>
    <section class="hero" v-else>
      <div class="hero-body">
        <p class="title">{{blogs.blog.title}}</p>
      </div>
    </section>
    <section class="section" id="app">
        <div class="content">
            <div class="card has-background-light">
                <div class="card-image pt-5">
                    <div class="columns">
                        <div class="column" v-for="image in blogs.images" :key="image.id">
                            <figure class="image">
                                <img :src="image.file_path ? image.file_path : 'https://bulma.io/images/placeholders/640x360.png'" alt="Placeholder image">
                            </figure>
                        </div>
                    </div>
                    
                </div>
                <div class="card-content">
                    <div class="content">
                        {{blogs.blog.content}}
                    </div>
                    <div class="container">
                        <p class="subtitle">Comments</p>
                                <div class="box" v-for="comment in blogs.comments"  :key="comment.id">
                                    <article class="media">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                        <img :src="comment.file_path ? comment.file_path : 'https://bulma.io/images/placeholders/640x360.png'" alt="Placeholder image">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <div class="content">
                                        <p>
                                            {{comment.comment}}
                                        </p>
                                        <p class="is-size-7">{{comment.comment_date}}</p>
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
                            <form method="POST" action="/<%= blog.id %>/comments" enctype="multipart/form-data">
                                <div class="columns box">
                                    <div class="column is-7">
                                        <input class="input" type="text" name="comment" placeholder="Comment here..." value="">
                                    </div>
                                    <div class="column is-3">
                                        <div class="file">
                                            <label class="file-label">
                                              <input class="file-input" type="file" name="comment_image">
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
                                        <input class="button is-primary" type="submit" value="Submit">
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
            blogs : null
        }
    },
    created() {
        axios
            .get("http://localhost:3000/blogs/"+ this.$route.params.id)
            .then((response) => {
                this.blogs = response.data;
                console.log(this.blogs);
            })
            .catch((err) => {
                console.log(err);
            });
    },
}
</script>