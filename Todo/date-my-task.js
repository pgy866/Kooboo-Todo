/** add task */
let id = 0;
var vue = new Vue({
  el: '#date-my-task',
  data() {
    /*任务标题验证*/
    var validTitle =(rule,value,callback)=>{
        if(value == ''|| value == undefined){
            callback(new Error('请输入标题'))
        } else if(/^\s+|\s+$/.test(value)){
            callback(new Error('内容首尾不能出现空格'))
        } else {
            callback()
        }
    };
    return {
      outerVisible: false,
      undoSelect: false,
      remindSelect: false,
      addSubmitBtn: false,
      getCategoryData: [],
      monthCheckbox: [],
      employeeList: [],
      toAddForm: {
        title: '',
        desc: '',
        isRepeat: '',
        repeatArr: [],
        startTimestamp: '',
        endTimestamp: '',
        startFormat: '',
        endFormat: '',
        isShowRemind: false,
        categoryData: [],
        assignUser: '',
        deadline: ''
      },
      ruleForm: {
        title: [{ required: true, validator: validTitle, trigger: 'blur' }],
        startTimestamp: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        endTimestamp: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        isRepeat: [{ required: true, message: '请选择是否重复', trigger: 'change' }],
        repeatArr: [{ required: true, message: '请选择重复方式', trigger: 'change' }]
      },
      pickerArrivalDate: {
        disabledDate(time) {
          var beginDateVal = Date.now()
          return time.getTime() < beginDateVal - 8.64e7
        }
      },
      repeatOptions: [{ label: '每天',value: 'day'},{ label: '按周',value: 'week',
      children: [{ value: '0',label: '星期日'},{ value: '1',label: '星期一'},{ value: '2',label: '星期二'},
                    { value: '3',label: '星期三'},{ value: '4',label: '星期四'},{ value: '5',label: '星期五'},{value: '6',label: '星期六'}]},
                    { label: '按月',value: 'month',children: []}],
    }
  },
  created() {
    this.getDay()
    this.getCategory()
  },   
  methods: {
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
    getCategory () {
      axios.get('/api/taskData/get').then((res) => {
        if (res.data.success) {
          this.getCategoryData = res.data.model.categoryArr
          this.employeeList = res.data.model.assignName
        }
      }).catch(error => console.log(error))
    },
    repeatRadio(formName) {
        var fields = this.$refs[formName].fields
        fields.map(i => {
            if(i.prop === 'startTimestamp'){
                i.resetField() 
                return false
            }
        })
        this.toAddForm.repeatArr = []
        this.toAddForm.endTimestamp = ''
        this.undoSelect = true
    },
    noRepeatRadio(formName){
      var fields = this.$refs[formName].fields
      fields.map(i => {
          if(i.prop === 'repeatArr'){
              i.resetField() 
              return false
          }
      })
      this.toAddForm.startTimestamp = ''
      this.toAddForm.endTimestamp = ''
      this.undoSelect = false
    },
    outerSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSubmitBtn = true;
          this.toAddForm.desc = tinyMCE.activeEditor.getContent()
          this.toAddForm.startFormat = moment(this.toAddForm.startTimestamp).format('YYYY-MM-DD')
          if (this.toAddForm.endTimestamp !== "") {
            this.toAddForm.endFormat = moment(this.toAddForm.endTimestamp).format('YYYY-MM-DD')
          }
          this.toAddForm.todayDate = moment().format('YYYY-MM-DD')
          this.toAddForm.todayTimestamp = moment(this.toAddForm.todayDate).valueOf()
          var data = JSON.stringify(this.toAddForm)
          data = encodeURIComponent(data)
          axios.post('/api/task/add', data).then((res) => {
            if(res.data.success) {
              this.outerResetForm(formName)
              this.$message({
                  message: res.data.message,
                  type: 'success',
                  center: true
              });
              setTimeout(() => {
                  location.reload();
              }, 1000)
            }
          }).catch((err) => { console.log(err) })
        }
      })
    },
    outerResetForm(formName) {
      this.$refs[formName].resetFields()
      tinymce.activeEditor.getBody().innerText = ""
      this.outerVisible = false
      this.undoSelect = false
      this.remindSelect = false
    },
    showModal() {
      this.outerVisible = true;
      this.addSubmitBtn = false;
      setTimeout(_ => {
        this.initTinymac()
      }, 300)
    },
    changeRemindSelect(val) {
      this.remindSelect = val
    },

    getDay() {
      var allDay = moment().daysInMonth()
      var dayArray = []
      for (var i = 1; i <= allDay; i++) {
          dayArray.push({
            value: i,
            label: i
          })
      }
      this.monthCheckbox = dayArray
      this.repeatOptions.forEach(item => {
        if (item.value == 'month') {
          item.children = dayArray
        }
      })
    }
  }
})