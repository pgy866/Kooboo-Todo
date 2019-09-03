const numToDay = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

var vue = new Vue({
  el: '#application-meeting-room',
  data() {
    /*会议室标题验证*/
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
        applicationLoading: true,
        disabledBookBtn: false,
        scheme: [
              { time: "08:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '08:30 - 09:00'},
              { time: "09:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '09:00 - 09:30' },
              { time: "09:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '09:30 - 10:00' },
              { time: "10:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '10:00 - 10:30' },
              { time: "10:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '10:30 - 11:00' },
              { time: "11:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '11:00 - 11:30' },
              { time: "11:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '11:30 - 12:00' },
              { time: "12:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '12:00 - 12:30' },
              { time: "12:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '12:30 - 13:00' },
              { time: "13:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '13:00 - 13:30' },
              { time: "13:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '13:30 - 14:00' },
              { time: "14:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '14:00 - 14:30' },
              { time: "14:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '14:30 - 15:00' },
              { time: "15:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '15:00 - 15:30' },
              { time: "15:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '15:30 - 16:00' },
              { time: "16:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '16:00 - 16:30' },
              { time: "16:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '16:30 - 17:00' },
              { time: "17:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '17:00 - 17:30' },
              { time: "17:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '17:30 - 18:00' },
              { time: "18:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '18:00 - 18:30' },
              { time: "18:30", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '18:30 - 19:00' },
              { time: "19:00", monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '', timeQuantum: '19:00 - 19:30' }],
        colConfigs: [{date: '时间', prop: 'timeQuantum', label: '时间', id: 7}],
        rooms: [
              { id: 'room-1', name: '活动室大玻璃会议室' },
              { id: 'room-2', name: '活动室小玻璃会议室' },
              { id: 'room-3', name: '活动室沙发' },
              { id: 'room-4', name: 'gobear玻璃会议室' },
              { id: 'room-5', name: '前台沙发' },
              { id: 'room-6', name: '财务室旁大会议室' },
              { id: 'room-7', name: '财务室旁小会议室' },
          ],
        currentRoom: '',
        tableData: [],
        bgColors: [{ background: '#55bfff', color: '#fff', border: '1px solid' }],
        row: '',
        meetings: [],
    
       /*application booking button*/
        modalVisible: false,
        bookingForm: {
              title: '',
              meetingRoom: '',
              date: '',
              startTime: '',
              endTime: '',
              team: '',
              number: '',
          },
          pickerArrivalDate: {
            disabledDate(time) {
              var beginDateVal = Date.now()
              return time.getTime() < beginDateVal - 8.64e7
            }
          },
          teamsList: [],
          rules: {
              title: [{ required: true, validator: validTitle, trigger: 'blur' }],
              meetingRoom: [{ required: true, message: '请选择会议室', trigger: 'change' }],
              date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
              startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
              endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],    
              team: [{ required: true, message: '请选择项目组', trigger: 'change' }],
          },
    
        /*application myBook button*/
        myBookVisible: false,
        classIsloaded: true,
        myBookLoading: false,
        dataLength: [],
        myBookData: [],
        pageTotal: 0,
        pageSize: 5,
        pageNum: 1,
        bookHidePage: true
      }
  },
  methods: {
    /**application meeting room */
    titleColConfigs() {
        var dateArr = []
        for (i = 0; i< 7; i++) {
            dateArr.push({
               date: moment().add(i, 'days').format('YYYY-MM-DD'),
               weekDay: moment().add(i, 'days').day(),
               weekName: moment().add(i, 'days').format('dddd'),
               weekFor: ''
           })
        }
        dateArr.map(item => {
            
        switch(item.weekDay){
            case 1:
                item.weekFor = 'monday';
                break;
            case 2:
                item.weekFor = 'tuesday';
                break;
            case 3:
                item.weekFor = 'wednesday';
                break;
            case 4:
                item.weekFor = 'thursday';
                break;
            case 5:
                item.weekFor = 'friday';
                break;
            case 6:
                item.weekFor = 'saturday';
                break;
            case 0:
                item.weekFor = 'sunday';
                break;

        }
            this.colConfigs.push({
                date: item.date,
                id: item.weekDay,
                label: item.weekName,
                prop: item.weekFor
            })
        })
    },
    getId(key) {
        var num = key + 2;
        return 'room-' + num
    },
    getBookTable(roomId,bookMRoom) {
        var that = this;
        var bookTable = [], scheme = _.cloneDeep(this.scheme);
        this.meetings = [];
        if (roomId == 1) { bookTable = bookMRoom.roomOneBook };
        if (roomId == 2) { bookTable = bookMRoom.roomTwoBook };
        if (roomId == 3) { bookTable = bookMRoom.roomThrBook };
        if (roomId == 4) { bookTable = bookMRoom.roomFouBook };
        if (roomId == 5) { bookTable = bookMRoom.roomFriBook };
        if (roomId == 6) { bookTable = bookMRoom.roomSixBook };
        if (roomId == 7) { bookTable = bookMRoom.roomSevBook };
        bookTable.forEach(function (meeting, idx) {
            var startRowIdx = scheme.findIndex(function (item) {
                return item.time == meeting.startTime
            })
            var endRowIdx = scheme.findIndex(function (item) {
                return item.time == meeting.endTime
            })
            var targetDay = numToDay[new Date(meeting.date).getDay()];
            scheme.forEach(function (item, idx) {
                if (idx >= startRowIdx && idx < endRowIdx) {
                    item[targetDay] = meeting.team;
                }
            })
            that.meetings.push({
                startRowIdx,
                endRowIdx,
                columnIdx: that.colConfigs.findIndex((conf) => {
                    return conf.prop == targetDay
                }),
                bgColor: that.bgColors[0],
            })
        })
        this.tableData = scheme;
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
        var bg = {};
        this.meetings.forEach(function (meeting) {
            if (rowIndex >= meeting.startRowIdx && rowIndex < meeting.endRowIdx && columnIndex == meeting.columnIdx) {
                bg = meeting.bgColor;
            }
        })
        return  bg
    },
    onChangeRoom(rid) {
        this.currentRoom = rid;
    },
    getCurrentRom () {
        this.currentRoom = this.rooms[0].id;
    },

   /*application booking button*/
    stringToTimesTamp(stringTime) {
        var strTime = new Date(stringTime);
        var numTime = strTime.getTime();
        return numTime;
    },
    showAddBooking () {
        this.modalVisible = true
        this.disabledBookBtn = false
    },
    submitBooking(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                var startTimeString = this.bookingForm.date + ' ' + this.bookingForm.startTime;
                var startTimesTamp = this.stringToTimesTamp(startTimeString);
                var endTimeString = this.bookingForm.date + ' ' + this.bookingForm.endTime;
                var endTimesTamp = this.stringToTimesTamp(endTimeString);
                var now = new Date();
                var currentTime = now.getTime();
                if (endTimesTamp <= startTimesTamp) {
                    this.$message({
                        message: "结束时间不能早于或等于开始时间",
                        type: 'error',
                        center: true
                    });
                } else if (endTimesTamp < currentTime) {
                    this.$message({
                        message: "不能预约过去时间",
                        type: 'error',
                        center: true
                    });
                } else {
                    this.bookingForm.startTimesTamp = startTimesTamp;
                    this.bookingForm.endTimesTamp = endTimesTamp;
                    this.disabledBookBtn = true
                    var data = JSON.stringify(this.bookingForm)
                    data = encodeURIComponent(data)
                    axios.post('/api/MRoom/book', data).then((res) => {
                        if (res.data.success) {
                            this.$message({
                                message: res.data.message,
                                type: 'success',
                                center: true
                            });
                            setTimeout(() => {
                                location.reload()
                            }, 300)
                        } else {
                            if (res.data.message) {
                                this.$message({
                                    message: res.data.message,
                                    type: 'error',
                                    center: true
                                });
                            } else {
                                this.$message({
                                    message: "预约失败",
                                    type: 'error',
                                    center: true
                                });
                            }
                            this.disabledBookBtn = false
                        }
                    }).catch((err) => {console.log(err)})
                }
            }
        })
    },
    hideBookingModal(formName) {
        this.$refs[formName].resetFields();
        this.modalVisible = false;
    },

   /*application myBook button*/
   beforCloseModal(done) {
        if( this.dataLength !== this.myBookData.length) {
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
    getCurrentData(num) {
        this.pageNum = num
        if (this.pageTotal > this.pageSize) {
            this.bookHidePage = false
        } else {
            this.bookHidePage = true
        }
    },
    showMyBook(num) {
        this.myBookVisible = true;
        this.myBookLoading =true;
        axios.post('/api/myBook/get').then((res) => {
            if (res.data.success) {
                this.myBookData = res.data.model;
                this.myBookData.forEach(index => {
                    index.getDay = moment(index.date).format('dddd')
                })
                if(this.classIsloaded) {
                    this.classIsloaded = false
                    this.dataLength = this.myBookData.length
                    num = 1
                }
                
                this.pageTotal = this.myBookData.length
                this.getCurrentData(num)
                this.myBookLoading = false;
            }
        }).catch((err) => {console.log(err)})
    },
    handleDelete(index, row) {
        if (confirm('确定删除该条预约记录吗？')) {
            axios.post('/api/myBook/delete', {params: 'deleteRow', data: row}).then((res) => {
                if (res.data.success) {
                    if (parseInt((this.pageTotal)/5) < this.pageNum && ((this.pageTotal-1)/5)%1 === 0) {
                        var num = this.pageNum - 1
                    } else {
                        var num = this.pageNum
                    }
                    this.showMyBook(num)
                    this.$message({
                        message: res.data.message,
                        type: 'success',
                        center: true
                    });
                }
            }).catch((err) => {console.log(err)})
        }
    },
    deleteAllData() {
        var dataLen = this.myBookData.length
        if (dataLen == 500) {
            if (confirm('确定删除当前显示的500条预约数据吗')) {
                axios.post('/api/myBook/delete', {params: 'deleteTotal', data: this.myBookData}).then((res) => {
                    if (res.data.success) {
                        var num = 1
                        this.showMyBook(num)
                        this.$message({
                            message: res.data.message,
                            type: 'success',
                            center: true
                        });
                    }
                }).catch((err) => {console.log(err)})
            }
        } else if (dataLen > 0 && dataLen < 500){
            if (confirm('确定删除全部预约数据吗')) {
                axios.post('/api/myBook/delete', {params: 'deleteTotal', data: this.myBookData}).then((res) => {
                    if (res.data.success) {
                        var num = 1
                        this.showMyBook(num)
                        this.$message({
                            message: res.data.message,
                            type: 'success',
                            center: true
                        });
                    }
                }).catch((err) => {console.log(err)})
            }
        } else {
            this.$message({
                message: '当前没有预约数据可删除',
                type: 'error',
                center: true
            });
        }
    }
  },
  created() {
    this.titleColConfigs()
    this.getCurrentRom()
  },
  watch: {
    currentRoom(rid) {
        var roomId = parseInt(rid.split('-')[1]);
        axios.get('/api/MRoom/get').then((res) => {
            if (res.data.success) {
                var bookMRoom = res.data.model.bookMRoom;
                this.teamsList= res.data.model.projectTeam;
                this.getBookTable(roomId,bookMRoom)
                this.applicationLoading = false
            }
        }).catch((err) => {console.log(err)})
    }
  }
})