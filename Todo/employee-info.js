  var vue = new Vue({
    el: "#employee-info",
    data() {
        /*手机号的十一位数验证*/
        var validMobile=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback(new Error('请输入11位手机号'))
            }else{
                let reg=/^1[34578]\d{9}$/
                if(!reg.test(value)){
                    callback(new Error('请输入11位手机号'))
                } else {
                    callback()
                }
            }
        };
        /*身份证号码验证*/
        var validID=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback(new Error('请输入身份证号'))
            }else{
                let reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                if(!reg.test(value)){
                    callback(new Error('身份证号码格式不正确'))
                } else {
                    callback()
                }
            }
            
        };
        /*用户名验证*/
        var validName=(rule,value,callback)=>{
            if(value == ''|| value == undefined){
                callback(new Error('名字不能为空'))
            } else if(/^\s+|\s+$/.test(value)) { 
                callback(new Error('内容首尾不能出现空格'))
            } else {
                let reg=/^([\u4E00-\uFA29]*[a-z]*[A-Z]*\s*)+$/
                if(!reg.test(value)){
                    callback(new Error('不允许输入特殊字符'))
                } else {
                    callback()
                }
            }
        };

        
        return {
            visibleModal: false,
            editInfoModal: false,
            addSubmitBtn: false,
            editSubmitBtn: false,    
            classIsloaded: true,
            employeeLoad: true,
            pageShowList: [],
            getEmployeeTbData: [],
            filterDataList: [],
            historyData: [],
            employeeData: [],
            editInfoForm: {},
            pageTotal: 0,
            pageSize: 8,
            pageNum: 1,
            hidePage: true,
            inputInfoForm: {
                name: '',
                gender: '',
                email: '',
                phoneNum: '',
                birthDate: '',
                entryDate: '',
                jobRole: '',
                idCardNum: '',
                team : '',
                addressInfo: ''
            },
            ruleForm: {
                email: [{ required: true, message: '请输入邮件', trigger: 'blur' },
                        { type: 'email',  message: '邮件格式不正确', trigger: 'blur' }],
                phoneNum: [{  required: true, validator: validMobile, trigger:'blur' }],
                gender: [{ required: true, message: '请选择性别', trigger: 'change'}],
                birthDate: [{ required: true, type: 'date',  message: '请输入日期', trigger: 'change'}],
                entryDate: [{ required: true, type: 'date',  message: '请输入日期', trigger: 'change'}],
                idCardNum: [{ required: true, validator: validID, trigger:'blur' }],
                jobRole: [{ required: true, message: '请输入职位', trigger: 'blur'}],
                name: [{ required: true, validator: validName, trigger: 'blur' }]
            },
            teamsList: [],
            roleList: [],
            searchName: '',
            infoNum: ''
        }
    },
    created: function(){
        /*获取数据进行最初数据分页*/
        axios.get('/api/employeeInfo/get').then((res) => {
            if(res.data.success) {
                this.getEmployeeTbData = res.data.model.getInfoTb
                this.employeeData = res.data.model.getInfoTb
                this.teamsList = res.data.model.projectTeam
                this.roleList = res.data.model.jobRole
                this.getEmployeeTbData.forEach(index => {
                    index.entryDateFor = moment(index.entryDate).format('YYYY-MM-DD')
                })
                
                this.getShowList()
                this.showFirstData()
            }
        }).catch((err) => { console.log(err)})
        this.employeeLoad = false
    },
    methods: {
        editInfo(index, row) {
            /*点击编辑按钮获取当前点击行的数据*/
            this.editInfoModal = true
            this.editSubmitBtn = false;
            /*获取最初不被改变的值,匹配行赋值*/
            this.editInfoForm = JSON.parse(JSON.stringify(this.employeeData)).filter(item => {return item._id == row._id})[0]
        },
        showInfoModal() {
            /*关闭模态框, 禁用按钮解除*/
            this.visibleModal = true
            this.addSubmitBtn = false;
        },
        getEmployeeInfo(num) {
            /*删除,编辑,添加之后重新调取api*/
            axios.get('/api/employeeInfo/get').then((res) => {
                if(res.data.success) {
                    this.getEmployeeTbData = res.data.model.getInfoTb
                    this.employeeData = res.data.model.getInfoTb
                    this.getEmployeeTbData.forEach(index => {
                        index.entryDateFor = moment(index.entryDate).format('YYYY-MM-DD')
                    })
                    /*调用分页方法,传入当前的页数*/
                    this.getShowList()
                    this.handleCurrentChange(num)
                }
            }).catch((err) => { console.log(err)})
        },
        deleteInfo(index, row) {
            if (confirm("确定删除该员工信息吗？")) {
                axios.post('/api/employeeInfo/delete', row).then((res) => {
                    if(res.data.success) {
                        /*删除信息, 页面数据改变重新统计当前页数*/
                        if (parseInt((this.pageTotal)/8) < this.pageNum && ((this.pageTotal-1)/8)%1 === 0) {
                            var num = this.pageNum - 1
                        } else {
                            var num = this.pageNum
                        }
                        /*调取更新api, 传入当前页数*/
                        this.getEmployeeInfo(num)
                        this.$message({
                            message: res.data.message,
                            type: 'success',
                            center: true
                        });
                    }
                }).catch((err) => {console.log(err)})
            }
        },
        editSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                this.editSubmitBtn = true;
                var data = JSON.stringify(this.editInfoForm)
                data = encodeURIComponent(data)
                axios.post('/api/employeeInfo/add', data).then((res) => {
                    if(res.data.success) {
                    /*初始化模态框*/
                    this.editResetForm(formName)
                    /*调取更新api,传入当前页数据*/
                    this.getEmployeeInfo(this.pageNum)
                        this.$message({
                            message: res.data.message,
                            type: 'success',
                            center: true
                        });
                    } else {
                        this.$message({
                            message: '更新失败',
                            type: 'error',
                            center: true
                        });
                    }
                }).catch((err) => { console.log(err) })
                }
            })
        },
        editResetForm(formName) {
            /*初始化编辑信息模态框*/
            this.editInfoModal = false
            setTimeout(() => {
                this.$refs[formName].resetFields()
            },300)
        },

        addSubmitForm(formName) {
            /*添加新的员工信息*/
            this.$refs[formName].validate((valid) => {
                if (valid) {
                this.addSubmitBtn = true;
                var data = JSON.stringify(this.inputInfoForm)
                data = encodeURIComponent(data)
                    axios.post('/api/employeeInfo/add', data).then((res) => {
                        if(res.data.success) {
                            this.addResetForm(formName)
                            this.$message({
                                message: res.data.message,
                                type: 'success',
                                center: true
                            });
                            /*调取更新api, 传入当前页数*/
                            var num = 1;
                            this.getEmployeeInfo(num)
                        } else {
                            this.$message({
                                message: '添加失败',
                                type: 'error',
                                center: true
                            });
                        }
                    }).catch((err) => { console.log(err) })
                }
            })
        },
        addResetForm(formName) {
            /*初始化添加信息模态框*/
            this.$refs[formName].resetFields()
            this.visibleModal = false
        },

        doFilter(val) {
            //每次手动将数据置空,因为会出现多次点击搜索情况       
            this.filterDataList = []
            this.getEmployeeTbData.forEach((value, index) => {
                if(value.name){
                    if(value.name.nidexOf(val) >= 0){
                        this.filterDataList.push(value)
                    }
                }
            });
            //页面数据改变重新统计数据数量和当前页
            this.pageNum = 1
            //传入数组渲染表格
            this.getShowList(this.filterDataList)
            this.showFirstData()
        },
        getShowList(val) {
            //判断是搜索数据需要分页,还是调用的数据分页
            if (val) {
                this.historyData = val
            } else {
                this.historyData = this.getEmployeeTbData
            }
            this.pageTotal = this.historyData.length
            if (this.pageTotal > this.pageSize) {
                this.hidePage = false
            } else {
                this.hidePage = true
            }
        },
        showFirstData() {
            // 得到初始页显示的数据
            if (this.pageTotal <= this.pageSize) {
                this.pageShowList = this.historyData
                this.hidePage = true
            } else {
                this.hidePage = false
                this.pageShowList = this.historyData.slice(0, this.pageSize)
            }
        },
        handleSizeChange (size) {
            this.pagesize = size;
        },
        handleCurrentChange (index) {
        // 初始页pageNum、初始每页数据数pagesize和当前页数据pageShowList
            this.pageNum = index
            let _start = (index - 1) * this.pageSize
            let _end = index * this.pageSize
            this.pageShowList = this.historyData.slice(_start, _end)
        },
    }
})