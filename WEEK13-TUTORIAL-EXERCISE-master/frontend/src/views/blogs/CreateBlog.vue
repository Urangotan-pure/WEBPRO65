<template>
  <div class="container is-widescreen">
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger">
          <!-- <%= error.code + ': ' + error.sqlMessage %> -->
          <!---->
          {{ error }}
        </div>
      </div>
    </section>
    <section class="hero">
      <div class="hero-body">
        <p class="title">Create new Blog</p>
      </div>
    </section>
    <section class="px-6">
      <input class="mb-5" multiple type="file" accept="image/png, image/jpeg, image/webp" @change="selectImages" />

      <div v-if="images" class="columns is-multiline">
        <div v-for="(image, index) in images" :key="image.id" class="column is-one-quarter">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="showSelectImage(image)" alt="Placeholder image" />
              </figure>
            </div>
            <footer class="card-footer">
              <a @click="deleteSelectImage(index)" class="card-footer-item has-text-danger">Delete</a>
            </footer>
          </div>
        </div>
      </div>

      <div class="field mt-5">
        <label class="label">Title</label>
        <div class="control">
          <input v-model="$v.titleBlog.$model" :class="{ 'is-danger': $v.titleBlog.$error }" class="input" type="text"
            placeholder="Text input" />
        </div>
      </div>
      <!-- + -->
      <template v-if="$v.titleBlog.$error">
        <p class="help is-danger" v-if="!$v.titleBlog.required">This field is required</p>
        <p class="help is-danger" v-if="!$v.titleBlog.maxLength">title must not more than 25 letters</p>
        <p class="help is-danger" v-if="!$v.titleBlog.minLength">title must be at least 10 letters</p>
        <p class="help is-danger" v-if="!$v.titleBlog.onlyText">title only character</p>
      </template>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea v-model="$v.contentBlog.$model" :class="{ 'is-danger': $v.contentBlog.$error }" class="textarea"
            placeholder="Textarea"></textarea>
        </div>
      </div>
      <!-- + -->
      <template v-if="$v.contentBlog.$error">
        <p class="help is-danger" v-if="!$v.contentBlog.required">This field is required</p>
        <p class="help is-danger" v-if="!$v.contentBlog.minLength">content must be at least 50 letters</p>
      </template>

      <div class="field">
        <label class="label">Reference</label>
        <div class="control">
          <input v-model="$v.reference.$model" :class="{ 'is-danger': $v.reference.$error }" class="input" type="url"
            placeholder="e.g. https://www.google.com">
        </div>
      </div>
      <!-- + -->
      <template v-if="$v.reference.$error">
        <p class="help is-danger" v-if="!$v.reference.required">This field is required</p>
        <p class="help is-danger" v-if="!$v.reference.url">reference must be url "https"</p>
      </template>

      <div class="control mb-3">
        <label class="radio">
          <input v-model="statusBlog" type="radio" name="answer" value="status_private" />
          Private
        </label>
        <label class="radio">
          <input v-model="statusBlog" type="radio" name="answer" value="status_public" />
          Public
        </label>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input v-model="pinnedBlog" type="checkbox" />
            Pinned
          </label>
        </div>
      </div>

      <hr>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">วันที่โพสต์</label>
            <div class="control">
              <input class="input" type="date" v-model="$v.start_date.$model" :class="{ 'is-danger': $v.start_date.$error }">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">วันสิ้นสุดโพสต์</label>
            <div class="control">
              <input  class="input" type="date" v-model="$v.end_date.$model" :class="{ 'is-danger': $v.end_date.$error }">
            </div>
          </div>
        </div>
      </div>
      <template v-if="$v.end_date.$error || $v.start_date.$error">
        <p class="help is-danger" v-if="$v.start_date.$model">กรอก  end_date</p>
        <p class="help is-danger" v-if="$v.end_date.$model">กรอก start_date</p>
        <p class="help is-danger" v-if="$v.end_date.checkGreater"> เวลาไม่ถูกต้อง </p>
        <p class="help is-danger" v-if="$v.start_date.checkGreater"> เวลาไม่ถูกต้อง </p>
      </template>


      <div class="field is-grouped">
        <div class="control">
          <button @click="submitBlog" class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button @click="$router.go(-1)" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { required, minLength, maxLength, url ,  alpha} from 'vuelidate/lib/validators' //+

function onlyText(value) {
  if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && !(value.match(/[0-9]/)))) {
    return false
  }
  return true
}

function privateORpublic(value) {
  if (!(value === 'status_private' || value === 'status_public')) {
    return false
  }
  return true
}

function checkFileSize(file) {
  const fileSize = file.size; // ขนาดไฟล์ของรูปที่เลือก (byte)
  const maxSize = 1024 * 1024; // ขนาดสูงสุดที่อนุญาต (byte)

  if (fileSize > maxSize) {
    alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 1 MB');
    return false;
  }

  return true;
}

function checkenddate(value) {
  if (this.end_date) {
    console.log("true")
    return true
  }
  return false
}
function checkstartdate(value) {
  if (this.start_date) {
    console.log("true")
    return true
  }
  return false
}
function checkGreater(value) {
  if (this.start_date <= this.end_date) {
    console.log("true")
    return true
  }
  return false
}


export default {
  data() {
    return {
      blog: {},
      error: null,
      images: [], // array of image
      titleBlog: "",
      contentBlog: "",
      pinnedBlog: false,
      statusBlog: "status_public",
      reference: "",
      start_date: "",
      end_date: ""
    };
  },
  validations: {
    titleBlog: {
      required,
      onlyText: onlyText,
      maxLength: maxLength(25),
      minLength: minLength(10),
      // alpha: alpha //แค่นี้เอง ทำonlyText ทำไม
    },
    contentBlog: {
      required,
      minLength: minLength(50)
    },
    statusBlog: {
      required,
      minLength: minLength(8),
      privateORpublic: privateORpublic
    },
    reference: {
      required,
      url: url
    },
    start_date:{
      required :checkenddate,
      checkGreater : checkGreater
      //------------------------------
      // required: requiredIf(function () { return this.end_date})
    },
    end_date: {
      required : checkstartdate,
      checkGreater : checkGreater
      //------------------------------
      // required: requiredIf(function () { return this.start_date}),
      // minValue: function () { 
      //   if (this.start_date < this.end_date){
      //     return true
      //   }
      //   else{
      //     return false
      //   }
      // }

    }

  },
  methods: {
    selectImages(event) {
      this.images = event.target.files;
    },
    // showSelectImage(image) {
    //   // for preview only
    //   return URL.createObjectURL(image);
    // },
    showSelectImage(image) {
      // for preview only
      console.log(image.size)
      if (!checkFileSize(image)) {
        console.log("'ขนาดไฟล์รูปภาพต้องไม่เกิน 1 MB'")
      }
      else {
        console.log("555")
        return URL.createObjectURL(image);
      }
    },
      deleteSelectImage(index) {
        console.log(this.images);
        this.images = Array.from(this.images);
        this.images.splice(index, 1);
      },
      submitBlog() {
        let formData = new FormData();
        console.log(this.start_date, this.end_date)
        formData.append("title", this.titleBlog);
        formData.append("content", this.contentBlog);
        formData.append("pinned", this.pinnedBlog ? 1 : 0);
        formData.append("reference", this.reference); //+ 
        formData.append("start_date", this.start_date); //+
        formData.append("end_date", this.end_date); //+
        formData.append("status", this.statusBlog);
        this.images.forEach((image) => {
          formData.append("myImage", image);
        });

        console.log(this.statusBlog)
        console.log(this.pinnedBlog ? 1 : 0)
        console.log(this.pinnedBlog)
        // Note ***************
        // ตอนเรายิง Postmant จะใช้ fromData
        // ตอนยิงหลาย ๆ รูปพร้อมกันใน Postman จะเป็นแบบนี้

        // title   | "This is a title of blog"
        // comment | "comment in blog"
        // ...
        // myImage | [select file 1]
        // myImage | [select file 2]
        // myImage | [select file 3]

        // จะสังเกตุว่าใช้ myImage เป็น key เดียวกัน เลยต้องเอามา loop forEach
        // พอไปฝั่ง backend มันจะจัด file ให้เป็น Array เพื่อเอาไปใช้งานต่อได้

        axios
          .post("http://localhost:3000/blogs", formData)
          .then((res) => this.$router.push({ name: 'home' }))
          .catch((e) => console.log(e.response.data));
      },
    },
  };
</script>

<style></style>