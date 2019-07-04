<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item><i class="el-icon-tickets"></i> 基础表格</el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <!-- <el-button type="primary" icon="add" class="handle-del mr10" @click="add">新增</el-button> -->
                <el-input v-model="select_word" placeholder="搜索新闻" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="newsId" label="新闻序号" sortable width="80">
                </el-table-column>
                <el-table-column prop="newsTitle" label="新闻标题" sortable width="80">
                </el-table-column>
                <el-table-column prop="newsTime" label="更新时间" width="80">
                </el-table-column>
                <el-table-column prop="newsContent" label="新闻内容" width="80">
                </el-table-column>
                <el-table-column prop="newsClicks" label="点击次数" >
                </el-table-column>
                <el-table-column prop="newsImg" label="图片链接" >
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="新闻">
                    <el-input v-model="form.newsTitle"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容">
                    <el-input type="textarea" rows="5" v-model="form.newsContent"></el-input>
                </el-form-item>
                <el-form-item label="图片链接">
                    <el-input v-model="form.newsImg"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
import {postRequest,postJsonRequest} from '../../main'
    export default {
        name: 'basetable',
        inject:['reload'],
        data() {
            return {
                url: './static/vuetable.json',
                total:0,
                row2:'',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    content: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {//计算属性
            data() {//实现筛选
                return this.tableData;
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                postRequest("http://houtai.dota4.cn/public/getAllNews",{
                    page:this.cur_page
                }).then((res)=>{
                    console.log(res);
                   let data = res.data.data.list;
                    for(let i = 0; i < data.length;i++ ){
                        data[i].newsContent = data[i].newsContent.substring(0,20)+"..."
                    }
                    this.tableData = data;
                     this.total=res.data.data.total;
                })
           
            },
             search() {
                this.is_search = true;
                postRequest("http://houtai.dota4.cn/public/getNewsByName",{
                    newsName:this.select_word
                }).then((res)=>{
                    console.log(1111111111111111111111111111),
                    console.log(res);
                    let data = res.data.data;
                    for(let i = 0; i < data.length;i++ ){
                        data[i].newsContent = data[i].newsContent.substring(0,20)+"..."
                    }
                    this.tableData = data;
                    this.tableData=res.data.data;

                })
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                console.log(item)
                this.form.newsId=item.newsId;
                this.form.newsTitle=item.newsTitle;
                this.form.newsContent = item.newsContent;
                this.form.newsImg=item.newsImg;
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.row2=row;
                this.idx = index;
                this.delVisible = true;
            },
            // delAll() {
            //     const length = this.multipleSelection.length;
            //     let str = '';
            //     this.del_list = this.del_list.concat(this.multipleSelection);
            //     for (let i = 0; i < length; i++) {
            //         str += this.multipleSelection[i].name + ' ';
            //     }
            //     this.$message.error('删除了' + str);
            //     this.multipleSelection = [];
            // },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                console.log(this.form)
                postJsonRequest("http://houtai.dota4.cn/public/updateNews",this.form).then((res)=>{
                    console.log(res);
                    if(res.data.code == 200){
                        this.tableData=res.data.data;
                         this.$message.success('编辑成功');
                          this.delVisible = false;
                          this.reload();
                    }
                })
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){

                console.log(this.row2.newsId)
               this.tableData.splice(this.idx, 1);
                 postRequest("http://houtai.dota4.cn/public/deleteNewsById",{
                    newsId:this.row2.newsId
                }).then((res)=>{
                    console.log(res);
                    if(res.data.code == 200){
                        this.tableData=res.data.data;
                         this.$message.success('删除成功');
                         this.reload();
                          this.delVisible = false;
                    }
                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
