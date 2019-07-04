<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item> -->
                <!-- <el-breadcrumb-item>图片上传</el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">上传新闻</div>
            <div>
                <el-form v-model="form">
                    <el-form-item label="新闻标题">
                    <el-input v-model="form.newsTitle"></el-input>
                    <el-form-item label="新闻内容">
                        <el-input type="textarea" rows="5" v-model="form.newsContent"></el-input>
                    </el-form-item>
                    <el-upload
                    id="upload"
                        class="upload-demo"
                        drag
                        ref="upload"
                        :auto-upload="false"
                        :data="form"
                        :on-success="uploadSucess"
                        :on-error="uploadFailed"
                        action="http://localhost:8080/public/uploadNewsImg"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                  <el-button type="primary">上传<i class="el-icon-upload el-icon--right" @click="uplode"></i></el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'upload',
        data: function(){
            return {
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                form:{
                    newsImg:"/static/news",
                    newsContent:"",
                }
            }
        },
        components: {
            VueCropper
        },
        methods:{
            open1() {
                this.$notify({
                title: '成功',
                message: '这是一条成功的提示消息',
                type: 'success'
                });
            },
            uploadSucess(){
                console.log("543453")
                this.open1();
            },
            uploadFailed(){
                console.log("9843223")
            },
            uplode(){
                console.log("5454")
               
               this.$refs.upload.submit();
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        },
        created(){
            this.cropImg = this.defaultSrc;
        }
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>