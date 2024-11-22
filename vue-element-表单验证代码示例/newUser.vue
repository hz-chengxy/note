<template>
    <el-dialog
        :visible.sync="dialogTableVisible"
        destroy-on-close
        width="850px"
        :title="title"
        :before-close="closeForm"
    >
        <section class="head">
            <el-button :class="{'cur':activeName==='1'}" @click="activeName='1'">用户信息</el-button>
            <el-button :class="{'cur':activeName==='2'}" @click="toNext('ruleForm','2')">所属组织</el-button>
            <el-button :class="{'cur':activeName==='3'}" @click="toNext('ruleForm','3')">角色设置</el-button>
        </section>
        <section class="content_dia">
            <section v-show="activeName==='1'" class="user-info">
                <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="150px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="用户名" prop="USERNAME">
                        <el-input v-model="ruleForm.USERNAME" :disabled="title !=='新建用户'" placeholder="8~30个字符，必须包含字母"></el-input>
                    </el-form-item>
                    <el-form-item v-if="title ==='新建用户'" label="密码" prop="PASSWORD">
                        <el-input
                            v-model="ruleForm.PASSWORD"
                            auto-complete="new-password"
                            type="password"
                            show-password
                            placeholder="8~16个字符，必须包含数字、小写字母和符号"
                        ></el-input>
                        <el-progress
                            v-if="ruleForm.PASSWORD!==''"
                            :percentage="passwordPercent"
                            :format="passwordPercentFormat"
                        ></el-progress>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="TRUENAME">
                        <el-input v-model="ruleForm.TRUENAME" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="MOBILE">
                        <el-input v-model="ruleForm.MOBILE" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="EMAIL">
                        <el-input v-model="ruleForm.EMAIL" auto-complete="new-password" placeholder="例如：2345@163.com"></el-input>
                    </el-form-item>
                </el-form>
            </section>
            <section v-if="activeName==='2'" class="sszz-box">
                <user-group
                    :tree-data-info.sync="treeData"
                    :tages.sync="tags"
                    :default-props="defaultProps"
                    :node-key="'GROUPID'"
                    :tag-key="'GROUPID'"
                ></user-group>
            </section>
            <section v-if="activeName==='3'" class="clearfix jssz-box">
                <transfer
                    :right-people.sync="targetsInfo"
                    :user-option="userOption"
                    :title="dialogTitle"
                ></transfer>
            </section>
        </section>
        <template v-if="activeName==='1'" slot="footer">
            <div class="btn-box">
                <el-button @click="closeForm">取消</el-button>
                <el-button v-if="title==='新建用户'" type="primary" @click="toNext('ruleForm','2')">下一步</el-button>
                <el-button v-else type="primary" @click="sendFormChange('ruleForm')">修改</el-button>
            </div>
        </template>
        <template v-else-if="activeName==='2'" slot="footer">
            <div class="btn-box">
                <el-button @click="activeName='1'">上一步</el-button>
                <el-button v-if="title==='新建用户'" type="primary" @click="toNext('ruleForm','3')">下一步</el-button>
                <el-button v-else type="primary" @click="sendFormChange('ruleForm')">修改</el-button>
            </div>
        </template>
        <template v-else slot="footer">
            <div class="btn-box">
                <el-button @click="activeName='2'">上一步</el-button>
                <el-button v-if="title==='新建用户'" type="primary" @click="sendForm('ruleForm')">确定</el-button>
                <el-button v-else type="primary" @click="sendFormChange('ruleForm')">修改</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import userGroup from './userGroup';
import publicOptions from '@/plugins/publicOptions.js';
import Transfer from '@/components/normal/transfer/editTransfer';
import trsCommon from '@/plugins/common.js';

export default {
    name: 'NewUser',
    components: {
        userGroup,
        Transfer,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '新建用户',
        },
        group: {
            type: Array,
            default: () => {
                return [];
            },
        },
        disabled: {
            type: Boolean,
            default: true,
        },
        roleData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        formInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },

        returnValue: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        const validateEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (value) {
                if (mailReg.test(value)) {
                    var params = {
                        serviceid: 'mlf_usermanagement',
                        methodname: 'checkEmail',
                        email: value,
                        userId: this.title !== '新建用户' ? this.returnValue.USER[0].USERID : undefined,
                    };
                    this.$axios.post('/wcm/mlfcenter.do', params, { noLoading: true }).then(res => {
                        if (res.DETAIL !== '邮箱可以使用') {
                            callback(new Error('该邮箱已被使用！'));
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback(new Error('Email格式不正确！'));
                }
            } else {
                callback();
            }
        };
        const validateUserName = (rule, value, callback) => {
            if (this.title === '新建用户') {
                if (value.indexOf('@') !== -1) {
                    callback(new Error('不能包含@符号'));
                } else {
                    const params = {
                        serviceid: 'mlf_usermanagement',
                        methodname: 'checkUserName',
                        USERNAME: value,
                        userId: this.title !== '新建用户' ? this.returnValue.USER[0].USERID : undefined,
                    };
                    this.$axios.post('/wcm/mlfcenter.do', params, { noLoading: true }).then(res => {
                        if (res.DETAIL !== '用户名可以使用') {
                            callback(new Error(res.DETAIL));
                        } else {
                            callback();
                        }
                    });
                }
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            // 6-20位包含字符、数字和特殊字符
            var ls = 0;
            if (this.ruleForm.PASSWORD && this.ruleForm.PASSWORD !== '') {
                ls = this.judgePercent(ls);
                if (this.ruleForm.PASSWORD.length < 8 || this.ruleForm.PASSWORD.length > 16) {
                    callback(new Error('要求8-16位字符'));
                    ls = 0;
                }
                if (this.ruleForm.PASSWORD.match(/([\u4E00-\u9FA5])+/)) {
                    callback(new Error('不能包含中文字符'));
                    ls = 0;
                }
                switch (ls) {
                    case 0:
                        this.passwordPercent = 1;
                        callback(new Error('密码必须包含数字、字母 、字符'));
                        break;
                    case 1:
                        this.passwordPercent = 33;
                        callback(new Error('密码必须包含数字、字母 、字符'));
                        break;
                    case 2:
                        this.passwordPercent = 66;
                        callback(new Error('密码必须包含数字、字母 、字符'));
                        break;
                    case 3:
                    case 4:
                        this.passwordPercent = 100;
                        break;
                    default:
                        this.passwordPercent = 0;
                        break;
                }
                callback();
            }
            callback();
        };
        const validateTel = (rule, value, callback) => {
            if (value) {
                if (!/^1\d{10}$/.test(value)) {
                    callback(new Error('手机号格式错误！'));
                } else {
                    var params = {
                        serviceid: 'mlf_usermanagement',
                        methodname: 'checkUserPhone',
                        PHONENUMBER: value,
                        userId: this.title !== '新建用户' ? this.returnValue.USER[0].USERID : undefined,
                    };
                    this.$axios.get('/wcm/mlfcenter.do', { params: params, noLoading: true }).then(res => {
                        if (res.DETAIL !== '手机号可以使用') {
                            callback(new Error('该手机号码已被使用'));
                        } else {
                            callback();
                        }
                    });
                }
            } else {
                callback();
            }
        };
        return {
            dialogTableVisible: false,
            activeName: '1',
            ruleForm: {
                TRUENAME: undefined,
                PASSWORD: undefined,
                EMAIL: undefined,
                MOBILE: undefined,
                BIRTHDAY: undefined,
                UserId: 0,
                USERNAME: undefined,
                STAFFING: undefined,
                SEX: undefined,
                HIREDATE: undefined,
                WORKINGAGE: undefined,
                NATION: undefined,
                EDUCATION: undefined,
                PROFESSIONAL: undefined,
                POLITICS: undefined,
                POST: undefined,
                POSITION: undefined,
                USERCODE: undefined,
                serviceid: 'mlf_usermanagement',
                methodname: 'saveUser',
                GroupIds: undefined,
                RoleIds: undefined,
            },
            organInput: '',
            passwordPercent: 0,
            treeData: [],
            jueseTree: [],
            tags: [],
            defaultProps: {
                children: 'CHILDREN',
                label: 'OBJNAME',
                isLeaf: 'isLeaf',
                disabled: 'disabled',
            },
            rules: {
                USERNAME: [
                    { required: true, message: '这是必填项！', trigger: ['blur'] },
                    { min: 8, max: 30, required: true, message: '请输入8-30个字符', trigger: ['blur', 'change'] },
                    {
                        pattern: /^(?=.*[A-Za-z])[A-Za-z\d`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{8,30}$/,
                        message: '8~30个字符，必须包含字母',
                        trigger: ['blur', 'change'],
                    },
                    { validator: validateUserName, trigger: 'blur' },
                ],
                TRUENAME: [
                    { required: true, message: '这是必填项！', trigger: ['blur'] },
                ],
                EMAIL: [
                    // { required: true, message: '这是必填项！', trigger: ['blur,change'] },
                    { validator: validateEmail, trigger: ['blur', 'change'] },
                ],
                PASSWORD: [
                    { required: true, message: '这是必填项！', trigger: ['blur'] },
                    { validator: validatePassword, trigger: ['change', 'blur'] },
                ],
                MOBILE: [
                    // { required: true, message: '这是必填项！', trigger: ['blur'] },
                    { min: 11, max: 11, message: '手机号码格式错误   ', trigger: ['blur', 'change'] },
                    { validator: validateTel, trigger: ['blur', 'change'] },
                ],
            },
            count: 1,
            data: [], // 穿梭框
            value: [],
            groupList: [],
            targetsInfo: [],
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            cur: 'color: white:background-color: #d64541;',
            white: '',
            showCopyRight: false,
            dialogTitle: {
                selectDataTitle: '选择列表',
                selectDataListTitle: '未分配角色',
                resultTitle: '已分配角色',
            },
            userOption: {
                childParams: {
                    methodname: 'query',
                    serviceid: 'mlf_extrole',
                },
                key: 'ROLEID',
                name: 'USERNAME',

            },
            myPublicOptions: publicOptions,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                } },
        };
    },
    computed: {
        environment() {
            return this.$store.getters.getConfigInfo('managementConfiguration.differentEnv.value');
        },
    },
    watch: {
        visible(val) {
            this.dialogTableVisible = val;
        },
        dialogTableVisible(val) {
            if (val === false) {
                // this.initData();
            }
            this.$emit('update:visible', val);
        },
        targetsInfo: {
            handler: function(val) {
                this.$emit('update:roleData', val);
            },
            immediate: true,
            deep: true,
        },
        roleData: {
            handler: function(val) {
                this.targetsInfo = val;
            },
            immediate: true,
            deep: true,
        },
        formInfo: {
            handler: function(val) {
                if (val.USERID) {
                    for (let i in this.ruleForm) {
                        if (val[i]) {
                            this.ruleForm[i] = val[i].value ? val[i].value : val[i];
                        }
                    }
                }
            },
            immediate: true,
            deep: true,
        },
        group: {
            handler: function(val) {
                if (val.length) {
                    val.map(item => {
                        let obj = {};
                        obj.tagName = item.GROUPPATH;
                        obj.GROUPID = item.GROUPID;
                        this.tags.push(obj);
                    });
                }
            },
            immediate: true,
            deep: true,
        },
        'ruleForm.HIREDATE'(val) {
            if (val) {
                const arr = val.split('-');
                const hireData = arr[0] * 12 + arr[1] * 1;
                const day = new Date();
                this.ruleForm.WORKINGAGE = day.getFullYear() * 1 * 12 + day.getMonth() * 1 + 1 - hireData + '个月';
            }
        },

    },
    mounted() {
        this.queryGroupTree();
    },
    methods: {
        /**
         * 判断密码强度的百分比
         *
         * @param   {[type]}  ls  [ls description]
         *
         * @return  {[type]}      [return description]
         */
        judgePercent(ls) {
            if (this.ruleForm.PASSWORD) {
                if (this.ruleForm.PASSWORD.match(/([A-Z])+/) || this.ruleForm.PASSWORD.match(/([a-z])+/)) {
                    ls++;
                }
                if (this.ruleForm.PASSWORD.match(/([0-9])+/)) {
                    ls++;
                }
                if (this.ruleForm.PASSWORD.match(/([\W])+/) && !this.ruleForm.PASSWORD.match(/(![\u4E00-\u9FA5])+/)) {
                    ls++;
                }
            }

            return ls;
        },
        // 初始化置空数据
        initData() {
            this.ruleForm = {
                TRUENAME: undefined,
                PASSWORD: undefined,
                EMAIL: undefined,
                MOBILE: undefined,
                BIRTHDAY: undefined,
                UserId: 0,
                USERNAME: undefined,
                STAFFING: undefined,
                SEX: undefined,
                HIREDATE: undefined,
                WORKINGAGE: undefined,
                NATION: undefined,
                EDUCATION: undefined,
                PROFESSIONAL: undefined,
                POLITICS: undefined,
                POST: undefined,
                POSITION: undefined,
                USERCODE: undefined,
                serviceid: 'mlf_usermanagement',
                methodname: 'saveUser',
                GroupIds: undefined,
                RoleIds: undefined,
            };
            this.targetsInfo = [];
            this.activeName = '1';
            this.tags = [];
        },
        passwordPercentFormat(percentage) {
            switch (percentage) {
                case 1:
                    return '密码强度：无';
                case 33:
                    return '密码强度：弱';
                case 66:
                    return '密码强度：偏弱';
                case 100:
                    return '密码强度：强';
            }
        },
        // 获取所属组织结构树
        async queryGroupTree() {
            let res = await trsCommon.queryGroupTreeWithSecondRight();
            this.tool.opaTree(res);
            this.treeData = [res];
            this.jueseTree = [res];
        },
        getGroupList(data) {
            const params = {
                GroupId: data.GROUPID,
                methodname: 'query',
                serviceid: 'mlf_extrole',
            };
            this.$axios.get('/wcm/mlfcenter.do', { params: params }).then(res => {
                // this.groupList = res;
                this.data = [];
                res.forEach((item) => {
                    this.data.push({
                        label: item.ROLENAME,
                        key: item.ROLEID,
                        name: item.ROLENAME,
                    });
                });
            });
        },
        /**
         * 新建表单提交
         *
         * @return  {[type]}  [return description]
         */
        sendForm() {
            if (this.targetsInfo.length) {
                let USERID = '0';
                const GroupIds = [];
                const RoleIds = [];
                this.tags.map(item => {
                    GroupIds.push(item.GROUPID);
                });
                this.targetsInfo.map(item => {
                    RoleIds.push(item.ROLEID);
                });
                let myparams = {
                    GroupIds: GroupIds.join(','),
                    RoleIds: RoleIds.join(','),
                    // USERNAME: this.ruleForm.EMAIL,
                    USERID: USERID,
                };
                const params = Object.assign(this.ruleForm, myparams);
                this.sendParams(params, '新建成功！');
            } else {
                this.$message({
                    message: '请选择角色',
                    type: 'warning',
                });
            }
        },
        /**
         * 表单更改提交
         *
         * @return  {[type]}  [return description]
         */
        async sendFormChange() {
            const flag = await this.toNext('ruleForm', this.activeName);
            if (!flag) {
                return;
            }
            if (this.targetsInfo.length) {
                // const REGTIME = this.tool.getNowFormatDate();
                let USERID = '0';
                if (this?.returnValue?.USER[0] && this?.returnValue?.USER[0].USERID) {
                    USERID = this.returnValue.USER[0].USERID;
                }
                const GroupIds = [];
                const RoleIds = [];

                this.tags.map(item => {
                    GroupIds.push(item.GROUPID);
                });
                this.targetsInfo.map(item => {
                    RoleIds.push(item.ROLEID);
                });
                let myparams = {
                    USERID: USERID,
                    // USERNAME: this.returnValue.USER[0].USERNAME,
                    GroupIds: GroupIds.join(','),
                    RoleIds: RoleIds.join(','),
                };
                myparams = Object.assign(this.ruleForm, myparams);
                // const params = {};
                // for (let i in myparams) {
                //     if (myparams[i]) {
                //         params[i] = myparams[i];
                //     }
                // }
                this.sendParams(myparams, '修改成功！');
            } else {
                this.$message({
                    message: '请选择角色',
                    type: 'warning',
                });
            }
        },
        sendParams(params, mess) {
            // params.BIRTHDAY&&params.BIRTHDAY
            this.$axios.post('/wcm/mlfcenter.do', params).then(() => {
                this.closeForm();
                this.$emit('callback');
                this.$message({
                    showClose: true,
                    duration: '5000',
                    message: mess,
                    type: 'success',
                });
            });
        },
        closeForm() {
            this.initData();
            this.$emit('update:close', false);
        },
        async toNext(formName, index) {
            let flag = false;
            if (this.activeName === '1') {
                try {
                    flag = await this.$refs[formName].validate();
                } catch (e) {
                    console.log(e);
                }
                if (flag) {
                    this.activeName = index;
                }
            } else if (this.activeName === '2') {
                if (this.tags.length) {
                    this.activeName = index;
                    flag = true;
                } else {
                    this.$message({
                        message: '请选择所属组织',
                        type: 'warning',
                    });
                }
            } else {
                this.activeName = index;
                flag = true;
            }
            return flag;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        /**
         * 选择角色回调
         * @param result
         */
        selOk(result) {
            if (result.length) {
                const ids = result.map((i) => {
                    return i.ROLEID;
                });
                this.$axios.post('/wcm/mlfcenter.do', {
                    RoleIds: ids.join(','),
                    RoleId: this.role.ROLEID,
                    serviceid: 'mlf_extrole',
                    methodname: 'copyRoleRight',
                }).then((data) => {
                    if (data.code) {
                        this.$message.error(data.message);
                    } else {
                        this.$message.success('复制成功');
                        this.showCopyRight = false;
                    }
                });
            } else {
                this.showCopyRight = false;
            }
        },
        getTargets(arr) {
            // this.targetsInfo = [];
            arr.map(item => {
                this.targetsInfo = this.addNewItem(this.targetsInfo, item, 'ROLEID');
            });
        },
        addNewItem(arr, item, ID) {
            let isNew = true;
            arr.forEach(function(ele) {
                if (ele[ID] === item[ID]) {
                    isNew = false;
                }
            });
            if (isNew) {
                arr.push(item);
            }
            return arr;
        },
    },
};
</script>

<style scoped lang="less">
.user-info {
    width: 100%;
    height: 100%;
    /deep/.el-form {
        position: relative;
        box-sizing: border-box;
        padding-top: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .el-dialog__footer {
            .btn-box {
                width: 100%;
                // position: absolute;
                margin-top: -15px;
            }
        }
    }
    /deep/ .el-input--small {
        width: 80%;
    }
    /deep/.el-input--small .el-input__inner {
        height: 40px;
        border: none;
        background-color: #f4f5f7;
    }
}
.head {
    border-bottom: 4px solid #efefef;
    .el-button {
        border: none;
        border-radius: 0;
        margin-bottom: -4px;
        border-bottom: 4px solid #efefef;
        &:hover {
            background-color: #fff;
            color: #606266;
            border-bottom: 4px solid @main_color;
        }
    }
    .cur {
        border-bottom: 4px solid @main_color;
    }
}
.content_dia {
    overflow: scroll;
    height: 500px;
}
.jssz-box {
    .jssz {
        .hd {
            height: 40px;
            background-color: #f4f5f7;
            color: #2a2a2a;
            line-height: 40px;
            font-size: 16px;
            padding-left: 10px;
            text-align: center;
        }
    }
    .jtbmlb {
        width: 180px;
        border: 1px solid #ebeef5;
        min-height: 380px;
        margin-right: 10px;
        border-radius: 5px;
    }
}
.sszz-box {
    padding: 20px 0;
}
/deep/ .el-transfer-panel {
    width: 170px;
    min-height: 380px;
}
/deep/ .el-progress--line {
    width: 40%;
}
.right-box .yydh-ws .list {
    height: 370px;
}
/* stylelint-disable */
.btn-box {
    text-align: center;
}
.btn-box .el-button--default {
    margin-right: 30px;
    color: #fff;
    background-color: rgb(194, 197, 205);
}
.btn-box .el-button--default:hover {
    background-color: @main_color;
}
.btn-box .el-button--primary:hover {
    background-color: rgb(27, 102, 246);
}
/deep/.group-tree{
    height: 100%;
    margin: 10px;
}
/* stylelint-enable */
</style>
