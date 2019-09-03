var vue = new Vue({
  el: '#knowledge-my-article',
  data() {
    /*文章标题验证*/
    var validTitle =(rule,value,callback)=>{
        if(value == ''|| value == undefined){
            callback(new Error('请输入文章标题'))
        } else {
            if(/^\s+|\s+$/.test(value)){
                callback(new Error('内容首尾不能出现空格'))
            } else {
                callback()
            }
        }
    };
    return {
      openLoading: false,
      pageTotal: 0,
      pageSize: 5,
      pageNum: 1,
      hidePage: true,
      myArticleVisible: false,
      classIsloaded: true,
      myArticleTable: [],
      dataTable: [],
      myArticleTableCopy: [],
      firCategoryCopy: '',
      secCategoryCopy: '',
      currentCategory: '',

    // add article
      addLoading: false,
      addArticleModalVisible: false,
      addArticleBtn: false,
      articleForm: {
          title: '',
          desc: '',
          category: [],
      },
      fileSize: 0,
      categorys: [],
      fileList: [],
      filesName: [],
      rules: {
          title: [{ required: true, validator: validTitle, trigger: 'blur' }],
          category: [{ required: true, message: '请选择二级类别', trigger: 'change' }],
      },
      // update category
      updateCategoryText: '',
      editLoad: false
    }
  },
  methods: {
    // article main
      beforCloseModal(done) {
          if( this.dataTable.length === this.myArticleTable.length) {
              var count = 0;
              this.myArticleTable.map(index => {
                  this.dataTable.map(item => {
                      if (index._id === item._id) {
                          count ++
                      }
                  })
              })
              if (count !== this.dataTable.length || this.editLoad) {
                  location.reload()
              }
          } else {
              location.reload()
          }
          this.classIsloaded = true
      },
      handleSizeChange (size) {
          this.pagesize = size;
      },
      handleCurrentChange (index) {
          this.pageNum = index
      },
      showMyArticleModal(num) {
          this.myArticleVisible = true;
          this.openLoading = true
          axios.post('/api/myArticle/get').then((res) => {
              if (res.data.success) {
                  this.myArticleTable = res.data.model.allArticle
                  this.myArticleTableCopy = res.data.model.allArticle
                  this.categorys = res.data.model.categoryArr
                  this.myArticleTable.forEach((ele) => {
                    ele.sellShow = false
                  })
                  if(this.classIsloaded) {
                      this.classIsloaded = false
                      this.dataTable = this.myArticleTable
                      num = 1
                  }

                  this.pageTotal = this.myArticleTable.length
                  this.getCurrentData(num)
                  this.openLoading = false
              }
          })
      },
      getCurrentData(num) {
          this.pageNum = num
          if (this.pageTotal > this.pageSize) {
              this.hidePage = false
          } else {
              this.hidePage = true
          }
      },
      handleDelete(index, row) {
          if (confirm('确定删除该文章吗？')) {
              axios.post('/api/myArticle/delete', row).then((res) => {
                  if (res.data.success) {
                      if (parseInt((this.pageTotal)/5) < this.pageNum && ((this.pageTotal-1)/5)%1 === 0) {
                          var num = this.pageNum - 1
                      } else {
                          var num = this.pageNum
                      }
                      this.showMyArticleModal(num)
                      this.$message({
                          message: res.data.message,
                          type: 'success',
                          center: true
                      });
                  }
              })
          }
      },
      /* Add article */
      initTinymac() {
        tinymce.init({
            selector: '.mytextarea',
            statusbar: false,
            menubar: false,
            plugins: 'image link code toc',
            height: 150,
            toolbar: 'formatselect | fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | undo redo | bold italic | underline | forecolor | image | link | code | toc'
        })
      },
      showArticleModal() {
          this.addArticleModalVisible = true;
          this.addArticleBtn = false;
          this.addLoading = false
          setTimeout(_ => {
            this.initTinymac()
          }, 300)
      },
      beforeAvatarUpload(file) {
          var testmsg = file.name.indexOf('.')
          var nowSize =  file.size / 1024 / 1024
          const isLt100M = nowSize / 1024 / 1024 < 100
          const isLt0M = nowSize === 0
          const length = testmsg <= 120
          if (!length) {
              this.$message({
                message: '当前上传文件名不能超过120字符!',
                type: 'warning',
                center: true
              });
           }
           if(!isLt100M) {
             this.$message({
               message: '当前上传文件大小必须小于100MB!',
               type: 'warning',
               center: true
             });
           }
           if(isLt0M) {
             this.$message({
               message: '当前上传文件大小不能为0MB!',
               type: 'warning',
               center: true
             });
           }
           return isLt100M && length && !isLt0M
          },
      hideArticleModal(formName) {
            this.addArticleModalVisible = false
            this.$refs[formName].resetFields()
            this.fileList = []
            this.filesName = []
      },
      beforeCloseLoad(formName){
        if(this.addLoading){
            this.addArticleModalVisible = true
            this.$message({
              message: '正在上传，不能关闭!',
              type: 'error',
              center: true
            });     
        } else {
           this.hideArticleModal(formName)
        }
      },
      removeFiles(file) {
          var i = this.filesName.indexOf(file.name);
          if (i != -1) {
              this.filesName.splice(i, 1);
              this.fileList.splice(i, 1);
          }
      },
      handleExceed(file){
        this.$message({
          message: '最多只能上传三个文件!',
          type: 'warning',
          center: true
        });
      },
      uploadFiles(item) {
          var i = this.filesName.indexOf(item.file.name);
          if (i === -1) {
              this.filesName.push(item.file.name);
              this.fileList.push(item.file);
          }
      },
      onSubmit(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                let fileLength = 0;
                    /* push desc and files into articleForm */
                    var formData = new FormData();
                    this.articleForm.desc = tinyMCE.activeEditor.getContent()
                    formData.append('title', this.articleForm.title);
                    formData.append('desc', this.articleForm.desc);

                    formData.append('firLevelCategory', this.articleForm.category[0]);
                    formData.append('secLevelCategory', this.articleForm.category[1]);

                    this.fileList.map(index => {
                        let filename = index.name.replace(/[#|+|;|\s]/g, "")
                        fileLength = fileLength + index.size
                        formData.append('files', index, filename);
                    })
                  const fileLengthLimit = fileLength / 1024 / 1024
                  if (fileLengthLimit < 100) {
                    this.addLoading = true
                    this.addArticleBtn = true
                    axios.post('/api/article/add', formData).then((res) => {
                        if (res.data.success) {
                            this.addLoading = false
                            this.$message({
                                message: res.data.message,
                                type: 'success',
                                center: true
                            });
                            this.hideArticleModal(formName)
                            var num = 1
                            this.showMyArticleModal(num)
                        } else {
                          this.$message({
                              message: res.data.message,
                              type: 'error',
                              center: true
                          });
                          this.addLoading = false
                          this.addArticleBtn = false
                        }
                    }).catch((err) => {
                        this.addLoading = false
                        this.addArticleBtn = false
                        this.$message({
                            message: '上传错误',
                            type: 'error',
                            center: true
                        });
                        console.log(err)
                    })
                  } else {
                    this.$message({
                      message: '当前上传总的文件大小必须小于100MB!',
                      type: 'warning',
                      center: true
                    });
                  }
              }
          })
      },

      //edit category
      cellClick(row) {
          var index = this.myArticleTable.findIndex(item=> item._id === row._id);
          let obj = this.myArticleTable[index]
          obj.sellShow = !obj.sellShow
          this.$set(this.myArticleTable, index, obj)
          var changeMyArticleArr = JSON.parse(JSON.stringify(this.myArticleTableCopy))[index]
          this.firCategoryCopy = changeMyArticleArr.firLevelCategory
          this.secCategoryCopy = changeMyArticleArr.secLevelCategory
          this.currentCategory = [row.firLevelCategory, row.secLevelCategory]
      },
      closeIconClick(row) {
        var index = this.myArticleTable.findIndex(item=> item._id === row._id);
        let editObj = this.myArticleTable[index]
        editObj.sellShow = !editObj.sellShow
        this.$set(this.myArticleTable, index, editObj)
      },
      saveIconClick(row) {
        if(this.currentCategory.length > 0) {
            if (this.firCategoryCopy == this.currentCategory[0] && this.secCategoryCopy == this.currentCategory[1]) {
                this.$message({
                    message: '请选择其他类别',
                    type: 'error',
                    center: true
                })
            } else {
                var index = this.myArticleTable.findIndex(item=> item._id === row._id);
                var data = {
                    firLevelCategory: this.currentCategory[0],
                    secLevelCategory: this.currentCategory[1],
                    id: row._id
                }
                axios.post('api/articleCat/update', data).then((res)=> {
                    if (res.data.success) {
                        var returnData = res.data.model
                        row.secCategoryId = returnData.secCategoryId
                        row.firLevelCategory = returnData.firLevelCategory
                        row.secLevelCategory = returnData.secLevelCategory
                        let editObj = this.myArticleTable[index]
                        editObj.sellShow = !editObj.sellShow
                        this.$set(this.myArticleTable, index, editObj)
                        this.$message({
                            message: res.data.message,
                            type: 'success',
                            center: true
                        });
                        this.editLoad = true
                    }
                })
            }
        } else {
                this.$message({
                    message: '类别不能为空',
                    type: 'error',
                    center: true
                })
            }
        }
    }
})