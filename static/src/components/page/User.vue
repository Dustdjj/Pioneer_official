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
                <el-button type="primary" icon="add" class="handle-del mr10" @click="addVisible = true" >新增</el-button>
                <el-input v-model="select_word" placeholder="搜索用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="userId" label="序号" sortable width="120">
                </el-table-column>
                <el-table-column prop="userName" label="用户名称" width="120">
                </el-table-column>
                <el-table-column prop="userPassword" label="用户密码" >
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
       <!-- 新增弹出框 -->
        <el-dialog title="编辑" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form1" label-width="50px">
                <el-form-item label="用户名称">
                    <el-input v-model="form1.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                       <el-input v-model="form1.userPassword"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit1">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="用户名称">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                       <el-input v-model="form.userPassword"></el-input>
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
                row2:'',
                tableData: [],
                total:0,
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                addVisible:false,
                editVisible: false,
                delVisible: false,
                form1:{
                    userName:'',
                    userPassword:''
                },
                form: {
                    name: '',
                    desc: '',
                    // address: ''
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
                postRequest("http://houtai.dota4.cn/public/getAllUsers",{
                    page:this.cur_page
                }).then((res)=>{
                    console.log(res);
                    this.tableData = res.data.data.list;
                    this.total=res.data.data.total
                })
            },
            search() {
                this.is_search = true;
                postRequest("http://houtai.dota4.cn/public/selUserByName",{
                    userName:this.select_word
                }).then((res)=>{
                    console.log(1111111111111111111111111111),
                    console.log(res);
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
                this.form.userId=item.userId,
                this.form.userName=item.userName,
                this.form.userPassword=item.userPassword;
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.row2=row;
                this.idx = index;
                console.log(row)
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //新增
             saveEdit1() {
                this.$set(this.tableData, this.idx, this.form);
                postJsonRequest("http://houtai.dota4.cn/public/createUser",this.form1).then((res)=>{
                    console.log(res);
                    if(res.data.code == 200){
                        this.tableData=res.data.data;
                         this.$message.success('编辑成功');
                          this.addVisible = false;
                          this.reload();
                    }
                })
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                postJsonRequest("http://houtai.dota4.cn/public/updateUserById",this.form).then((res)=>{
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
                // console.log(this.row2.productId)
                this.tableData.splice(this.idx, 1);
                 postRequest("http://houtai.dota4.cn/public/deleteUserById",{
                    userId:this.row2.userId
                }).then((res)=>{
                    console.log(res);
                    if(res.data.code == 200){
                        this.tableData=res.data.data;
                         this.$message.success('删除成功');
                          this.delVisible = false;
                          this.reload();
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
